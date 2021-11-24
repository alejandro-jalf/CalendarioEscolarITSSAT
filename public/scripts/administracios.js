if (!sessionStorage.getItem('calendario_firts_session'))
    sessionStorage.setItem('calendario_firts_session', 'SI')
if (!localStorage.getItem('calendario_id_master_selected'))
    localStorage.setItem('calendario_id_master_selected', '')

var appAdministracion = new Vue({
    el: '#app',
    data() {
        return {
            login:  (typeof localStorage.getItem('calendario_p_login') === 'string') ?
                localStorage.getItem('calendario_p_login') === 'true' :
                localStorage.getItem('calendario_p_login'),
            dataUser: localStorage.getItem('calendario_data_user') ?
                JSON.parse(localStorage.getItem('calendario_data_user')) :
                { data: {}, empty: true },
            alert: {
                title: 'Advertencia',
                message: 'Any massage',
                type: 'warning',
                component: null,
            },
            loadingCount: 0,
            widthWindow: 0,
            firtsSession: sessionStorage.getItem('calendario_firts_session'),
            shiftSelected: false,

            // Para maestro actividades
            masterTask: localStorage.getItem('calendario_master_task') ?
                JSON.parse(localStorage.getItem('calendario_master_task')) :
                { data: [] },
            showOptionsMaster: false,
            statusMasterTask: 0,
            masterTaskActual: {},
            masterTaskActualEdit: {},

            // Para actividades
            idMasterSelected: null,
            idMasterTaskSearch: localStorage.getItem('calendario_id_master_selected'),
            showOptionsTasks: false,
            listTaskByIdMaster: localStorage.getItem('calendario_task_id_master') ?
                JSON.parse(localStorage.getItem('calendario_task_id_master')) :
                { data: [] },
            arrayYearTasks: [],
            statusTask: 0, //0 = lista, 1 = creando, 2 = Editando,
            taskNew: {
                idMaster: null,
                rangoFechas: true,
                year: null,
                meses: [],
                dias: [],
                area: null,
                titulo: '',
                observaciones: '',
                publica: true,
            },
            dias: [
                { day: 1, select: false }, { day: 2, select: false }, { day: 3, select: false }, { day: 4, select: false }, 
                { day: 5, select: false }, { day: 6, select: false }, { day: 7, select: false }, { day: 8, select: false }, 
                { day: 9, select: false }, { day: 10, select: false }, { day: 11, select: false }, { day: 12, select: false }, 
                { day: 13, select: false }, { day: 14, select: false }, { day: 15, select: false }, { day: 16, select: false }, 
                { day: 17, select: false }, { day: 18, select: false }, { day: 19, select: false }, { day: 20, select: false }, 
                { day: 21, select: false }, { day: 22, select: false }, { day: 23, select: false }, { day: 24, select: false }, 
                { day: 25, select: false }, { day: 26, select: false },{ day: 27, select: false }, { day: 28, select: false }, 
                { day: 29, select: false }, { day: 30, select: false },{ day: 31, select: false }
            ],
            meses: [
                { mes: 1, mesLetra: 'Enero', select: false }, { mes: 2, mesLetra: 'Febrero', select: false }, { mes: 3, mesLetra: 'Marzo', select: false },
                { mes: 4, mesLetra: 'Abril', select: false }, { mes: 5, mesLetra: 'Mayo', select: false }, { mes: 6, mesLetra: 'Junio', select: false },
                { mes: 7, mesLetra: 'Julio', select: false }, { mes: 8, mesLetra: 'Agosto', select: false }, { mes: 9, mesLetra: 'Septiembre', select: false },
                { mes: 10, mesLetra: 'Octubre', select: false }, { mes: 11, mesLetra: 'Noviembre', select: false }, { mes: 12, mesLetra: 'Diciembre', select: false },
            ],
            diaSelected: {}, 
            mesSelected: {},

            // Data para areas
            listAreas: localStorage.getItem('calendario_areas_data') ?
                JSON.parse(localStorage.getItem('calendario_areas_data')) :
                { data: [] },
        }
    },
    computed: {
        loading() {
            return this.loadingCount > 0
        },
        apodo() {
            return this.dataUser.data[0].nombre_user
        },
        backgroundHeader() {
            if (this.alert.type === 'warning') return 'bg-warning';
            if (this.alert.type === 'info') return 'bg-info';
            if (this.alert.type === 'success') return 'bg-success';
            if (this.alert.type === 'primary') return 'bg-primary';
            if (this.alert.type === 'danger') return 'bg-danger';
            if (this.alert.type === 'dark') return 'bg-dark';
            return 'bg-warning';
        },

        // Para maestro actividades
        styleFloatMaster() {
            return this.showOptionsMaster ? 'opacity: 1.0; right: 20pt;' : 'opacity: 0.0; right: 15pt;';
        },
        iconMasterTaskFloat() {
            return this.showOptionsMaster ? 'icofont-close' : 'icofont-tasks-alt';
        },
        descriptionActionMasterTask() {
            return this.statusMasterTask === 1 ? 'Creando nueva lista maestro' : 'Editando lista maestro';
        },
        createEditMasterTask() {
            return this.statusMasterTask === 1 || this.statusMasterTask === 3
        },
        masterTaskRefactor() {
            return this.masterTask.data.sort((a, b) => {
                return new moment(a.fecha_creada_master_task.replace('z', '')) <= new moment(b.fecha_creada_master_task.replace('z', '')) ? 1 : -1;
            });
        },

        // Para actividades
        iconTasksFloat() {
            return this.showOptionsTasks ? 'icofont-close' : 'icofont-sub-listing';
        },
        styleFloatTasks() {
            return this.showOptionsTasks ? 'opacity: 1.0; right: 20pt;' : 'opacity: 0.0; right: 15pt;';
        },
        listTaskByIdMasterRefactor() {
            return this.listTaskByIdMaster.data;
        },
        nameMasterTask() {
            return (this.listTaskByIdMaster.data.length > 0) ?
                'Lista maestro: ' + this.listTaskByIdMaster.data[0].id_master_task.titulo :
                'Lista vacia'
        },
        titleCardArea() {
            return this.statusTask === 1 ? 'Creando actividad' : 'Editando actividad'
        },

        // Para areas
        areasRefactor() {
            return this.listAreas.data
        },
    },
    mounted() {
        this.widthWindow = window.innerWidth;
        if (!this.login) window.location.href = '../index.html';
        else {
            if (this.firtsSession === 'SI') {
                this.loadListTasks();
                this.loadAreas();
                this.loadTasksByIdMaster(this.idMasterTaskSearch);
                sessionStorage.setItem('calendario_firts_session', 'NO');
            }
            
            this.loadAreas();
            const dateActual = this.getDateNow();
            const yearInitial = parseInt(dateActual.format('YYYY'));
            for (let index = 0; index < 5; index++) this.arrayYearTasks.push(yearInitial + index);
            
            window.addEventListener('keyup', (evt) => {
                if (evt.key === 'Shift') this.shiftSelected = false;
            });
            window.addEventListener('keydown', (evt) => {
                if (evt.key === 'Shift') this.shiftSelected = true;
            });
        }
    },
    methods: {
        formatDate(dateString, hours = false) {
            const formatHours = hours ? ' HH:MM:ss' : '';
            const dateFromat = dateString.replace('z', '');
            const datef = new moment(dateFromat);
            const formatApply = datef.format(`DD/MM/YYYY ${formatHours}`);
            return formatApply;
        },
        closeSession() {
            this.login = false;
            localStorage.setItem('calendario_p_login', false);
            window.location.href = '../index.html';
        },
        getDateNow() {
            return new moment().local(true)
        },
        setLoading(visible = false) {
            if (visible) this.loadingCount ++;
            else this.loadingCount --;
            if (this.loadingCount < 0) this.loadingCount = 0;
        },
        showAlert(message, title = 'Advertencia', type = 'warning') {
            this.alert.title = title;
            this.alert.message = message;
            this.alert.type = type;

            this.$refs.btnAlert.click()
        },

        // Para maestro actividades
        showOptionsMasterClick() { this.showOptionsMaster = !this.showOptionsMaster; },
        listMasterTask() {
            this.statusMasterTask = 0;
        },
        newMasterTask() {
            this.showOptionsMaster = false;
            this.statusMasterTask = 1;
            this.masterTaskActualEdit.titulo_master_task = '';
            this.masterTaskActualEdit.publicada_master_task = false;
        },
        detailsMasterTask(task) {
            this.masterTaskActual = task;
            this.statusMasterTask = 2;
        },
        editMasterTask(task) {
            this.masterTaskActual = task;
            const uuid = this.masterTaskActual.UUID_master_task;
            const title = this.masterTaskActual.titulo_master_task;
            const state = this.masterTaskActual.publicada_master_task;
            
            this.masterTaskActualEdit.UUID_master_task = uuid;
            this.masterTaskActualEdit.titulo_master_task = title;
            this.masterTaskActualEdit.publicada_master_task = state;
            this.statusMasterTask = 3;
        },
        refactorStatus(status) {
            return status ? 'Publicada' : 'Privada';
        },
        async loadListTasks() {
            try {
                this.showOptionsMaster = false;
                this.listMasterTask();
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/maestroactividades';

                this.setLoading(true);

                const response = await axios({
                    method: 'get',
                    url,
                })

                this.setLoading(false);

                if (response.data.success) {
                    localStorage.setItem(
                        'calendario_master_task',
                        JSON.stringify(response.data)
                    )
                    this.masterTask = response.data;
                } else {
                    this.showAlert(response.data.message, 'Fallo al cargar las listas de actividades', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo cargar las listas de actividades intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        validateNewMasterTask() {
            if (this.masterTaskActualEdit.titulo_master_task.trim() === '') {
                this.showAlert('Titulo no puede quedar vacio');
                return false;
            }
            return true;
        },
        async createMasterTask() {
            if (!this.validateNewMasterTask()) return false;
            try {
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/maestroactividades';

                this.setLoading(true);
                const dateAction = this.getDateNow().format('YYYY-MM-DDTHH:MM:ss') + '.000z';

                const response = await axios({
                    method: 'post',
                    url,
                    data: {
                        titulo_master_task: this.masterTaskActualEdit.titulo_master_task,
                        publicada_master_task: this.masterTaskActualEdit.publicada_master_task,
                        fecha_creada_master_task: dateAction,
                        creada_por_master_task: this.dataUser.data[0].UUID_user,
                        fecha_modificada_master_task: dateAction,
                        modificada_por_master_task: this.dataUser.data[0].UUID_user,
                    },
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito', 'success');
                    this.loadListTasks();
                } else {
                    this.showAlert(response.data.message, 'Fallo al crear maestro actividad', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al crear maestro actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        async updateMasterTask() {
            if (!this.validateNewMasterTask()) return false;
            try {
                const url =
                    'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/maestroactividades/' + 
                    this.masterTaskActualEdit.UUID_master_task;

                this.setLoading(true);

                const response = await axios({
                    method: 'put',
                    url,
                    data: {
                        titulo_master_task: this.masterTaskActualEdit.titulo_master_task,
                        publicada_master_task: this.masterTaskActualEdit.publicada_master_task,
                        fecha_modificada_master_task: this.getDateNow().format('YYYY-MM-DDTHH:MM:ss') + '.000z',
                        modificada_por_master_task: this.dataUser.data[0].UUID_user,
                    },
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito', 'success');
                    this.loadListTasks();
                } else {
                    this.showAlert(response.data.message, 'Fallo al actualizar maestro actividad', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al actualizar maestro actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        async updatePublicaMasterTask(task) {
            try {
                const url =
                    'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/maestroactividades/' + 
                    task.UUID_master_task +
                    '/publica';

                this.setLoading(true);
                const newPublic = !task.publicada_master_task;

                const response = await axios({
                    method: 'put',
                    url,
                    data: {
                        publicada_master_task: newPublic,
                    },
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito', 'success');
                    this.loadListTasks();
                } else {
                    this.showAlert(response.data.message, 'Fallo al actualizar maestro actividad', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al actualizar maestro actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        async deleteMasterTask(uuid_master_task) {
            try {
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/maestroactividades/' + uuid_master_task;

                this.setLoading(true);

                const response = await axios({
                    method: 'delete',
                    url,
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito', 'success');
                    this.loadListTasks();
                } else {
                    this.showAlert(response.data.message, 'Fallo al eliminar maestro actividad', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al eliminar maestro actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        
        // Para actividades
        daySelected(dia) {
            return dia.select ? 'bg-primary' : 'bg-light text-dark';
        },
        setSelectedDay(dia) {
            const daysSelected = this.dias.filter((dia) => dia.select).length;
            dia.select = !dia.select;
            if (daysSelected === 0) this.diaSelected = dia;
            else if (this.shiftSelected) {
                this.dias.forEach((dia) => { dia.select = false });
                if ((dia.day - this.diaSelected.day) < 0) {
                    for (let index = this.diaSelected.day; index >= dia.day; index--) {
                        const position = this.dias.find((dia) => dia.day === index)
                        if (position) position.select = true;
                    }
                } else {
                    for (let index = this.diaSelected.day; index <= dia.day; index++) {
                        const position = this.dias.find((dia) => dia.day === index)
                        if (position) position.select = true;
                    }
                }
            }
        },
        setSelectedMonth(mes) {
            const monthsSelected = this.meses.filter((mes) => mes.select).length;
            mes.select = !mes.select;
            if (monthsSelected === 0) this.mesSelected = mes;
            else if (this.shiftSelected) {
                this.meses.forEach((mes) => { mes.select = false });
                if ((mes.mes - this.mesSelected.mes) < 0) {
                    for (let index = this.mesSelected.mes; index >= mes.mes; index--) {
                        const position = this.meses.find((mes) => mes.mes === index)
                        if (position) position.select = true;
                    }
                } else {
                    for (let index = this.mesSelected.mes; index <= mes.mes; index++) {
                        const position = this.meses.find((mes) => mes.mes === index)
                        if (position) position.select = true;
                    }
                }
            }
        },
        showOptionsTasksClick() { this.showOptionsTasks = !this.showOptionsTasks;},
        searchListTaskByIdMaster() {
            if(this.idMasterSelected === null)
                this.showAlert('Necesita seleccionar una lista de actividades');
            else
                this.loadTasksByIdMaster(this.idMasterSelected)
        },
        reloadListTaskByIdMaster() {
            this.showOptionsTasks = false;
            this.statusTask = 0;
            if (this.idMasterTaskSearch.trim() !== '')
                this.loadTasksByIdMaster(this.idMasterTaskSearch);
        },
        async loadTasksByIdMaster(idMasterSelected) {
            try {
                this.showOptionsTasks = false;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/actividades/maestroactividades/' +
                idMasterSelected;

                this.setLoading(true);

                const response = await axios({
                    method: 'get',
                    url,
                })

                this.setLoading(false);

                if (response.data.success) {
                    localStorage.setItem(
                        'calendario_task_id_master',
                        JSON.stringify(response.data)
                    )
                    this.listTaskByIdMaster = response.data;
                    this.idMasterTaskSearch = idMasterSelected;
                    localStorage.setItem('calendario_id_master_selected', idMasterSelected);
                } else {
                    this.showAlert(response.data.message, 'Fallo al cargar las actividades', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo cargar actividades intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        newTask() {
            this.showOptionsTasks = false;
            this.statusTask = 1
        },

        // Methodos para areas
        async loadAreas() {
            try {
                this.showOptionsTasks = false;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/areas';

                this.setLoading(true);

                const response = await axios({
                    method: 'get',
                    url,
                })
                console.log(response);

                this.setLoading(false);

                if (response.data.success) {
                    localStorage.setItem(
                        'calendario_areas_data',
                        JSON.stringify(response.data)
                    )
                    this.listAreas = response.data;
                } else {
                    this.showAlert(response.data.message, 'Fallo al cargar las areas', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo cargar areas intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
    },
})
