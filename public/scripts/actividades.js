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

            detailsTask: {},
            masterTask: localStorage.getItem('calendario_master_task') ?
                JSON.parse(localStorage.getItem('calendario_master_task')) :
                { data: [] },
            idMasterSelected: null,
            idMasterTaskSearch: localStorage.getItem('calendario_id_master_selected'),
            showOptionsTasks: false,
            listTaskByIdMaster: localStorage.getItem('calendario_task_id_master') ?
                JSON.parse(localStorage.getItem('calendario_task_id_master')) :
                { data: [] },
            arrayYearTasks: [],
            statusTask: 0, //0 = lista, 1 = creando, 2 = Editando, 3 = Visualizar
            taskNew: {
                idMaster: null,
                rangoFechas: true,
                dateInit: '',
                dateEnd: '',
                year: null,
                area: null,
                meses: [],
                dias: [],
                titulo: '',
                observaciones: '',
                publica: true,
            },
            dateInitTaskNew: '',
            dateEndTaskNew: '',
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

            // Master
            async loadListTasks() {
                try {
                    this.showOptionsMaster = false;
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
        // Para actividades
        editandoCreandoTask() {
            return this.statusTask === 1 || this.statusTask === 2;
        },
        styleFloat() {
            return this.statusTask === 0 ? 'opacity: 1.0; right: 20pt;' : 'opacity: 0.0; right: 15pt;';
        },
        iconTasksFloat() {
            return this.showOptionsTasks ? 'icofont-close' : 'icofont-sub-listing';
        },
        styleFloatTasks() {
            return this.showOptionsTasks ? 'opacity: 1.0; right: 20pt;' : 'opacity: 0.0; right: 15pt;';
        },
        listTaskByIdMasterRefactor() {
            return this.listTaskByIdMaster.data
                .sort((a, b) => new moment(a.fecha_creada_task.replace('z', '')) < new moment(b.fecha_creada_task.replace('z', '')) ? 1 : -1);;
        },
        nameMasterTask() {
            return (this.listTaskByIdMaster.data.length > 0) ?
                'Lista maestro: ' + this.listTaskByIdMaster.data[0].id_master_task.titulo :
                'Lista vacia'
        },
        titleCardArea() {
            return this.statusTask === 1 ? 'Creando actividad' : 'Editando actividad'
        },
        masterTaskRefactor() {
            return this.masterTask.data.sort((a, b) => {
                return new moment(a.fecha_creada_master_task.replace('z', '')) <= new moment(b.fecha_creada_master_task.replace('z', '')) ? 1 : -1;
            });
        },
        publicTask() {
            return this.taskNew.publica ? 'Actividad pendiente(Visible)' : 'Actividad cancelada(No visible)';
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
                this.loadAreas();
                this.loadTasksByIdMaster(this.idMasterTaskSearch);
                sessionStorage.setItem('calendario_firts_session', 'NO');
            }
            
            const dateActual = this.getDateNow();
            const yearInitial = parseInt(dateActual.format('YYYY'));
            for (let index = 0; index < 5; index++) this.arrayYearTasks.push(yearInitial + index);
            this.taskNew.year = yearInitial;
            
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
        arrayMonths() {
            return [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ]
        },

        // Para actividades
        setDataForEdit(data) {
            console.log(data);
            const {
                UUID_task, descripcion_task, dias_task,
                estatus_task, fecha_final_task, fecha_inicial_task,
                id_master_task, mes_task,
                observaciones_task, para_area_task, rango_fechas_task, year_task
            } = data;

            this.meses.map((mes) => {
                const mesFinded = mes_task.find((month) => month === mes.mes);
                if (mesFinded) mes.select = true;
                return mes
            });

            this.dias.map((dia) => {
                const diaFinded = dias_task.find((day) => day === dia.day);
                if (diaFinded) dia.select = true;
                return dia;
            });

            console.log(fecha_final_task.slice(0, 10));
            
            this.taskNew = {
                UUID_task,
                idMaster: id_master_task.uuid,
                rangoFechas: rango_fechas_task,
                dateInit: fecha_inicial_task.slice(0, 10),
                dateEnd: fecha_final_task.slice(0, 10),
                year: year_task,
                area: para_area_task.uuid,
                meses: mes_task,
                dias: dias_task,
                titulo: descripcion_task,
                observaciones: observaciones_task,
                publica: estatus_task
            }
            this.statusTask = 2;
        },
        viewTask(task) {
            this.statusTask = 3;
            this.detailsTask = { ...task }
        },
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
            this.loadListTasks();
            this.loadAreas();
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
        validateDataNewTask() {
            if (this.taskNew.idMaster === null) {
                this.showAlert('Se necesita elejir una lista maestro');
                return false;
            }
            if (this.taskNew.rangoFechas) {
                if (this.taskNew.dateInit === '') {
                    this.showAlert('Debe elejir la fecha de inicio');
                    return false;
                }
                if (this.taskNew.dateEnd === '') {
                    this.showAlert('Debe elejir la fecha de termino');
                    return false;
                }
                this.dateInitTaskNew = this.taskNew.dateInit + 'T12:00:00.000z';
                this.dateEndTaskNew = this.taskNew.dateEnd + 'T12:00:00.000z';
                this.taskNew.meses = [];
                this.taskNew.dias = [];
                this.taskNew.year = parseInt(this.getDateNow().format('YYYY'));
            } else {
                const daysSelected = this.dias.filter((dia) => dia.select);
                if (daysSelected.length === 0) {
                    this.showAlert('Falta seleccionar dia(s) de la actividad');
                    return false;
                }
                const monthsSelected = this.meses.filter((mes) => mes.select);
                if (monthsSelected.length === 0) {
                    this.showAlert('Falta seleccionar mes(es) de la actividad');
                    return false;
                }
                const dateActual = this.getDateNow().format('YYYY-MM-DDTHH:MM:ss') + '.000z';
                const mesesArray = this.meses.reduce((acumMes, mes) => {
                    if (mes.select) acumMes.push(mes.mes);
                    return acumMes;
                }, []);
                const dayArray = this.dias.reduce((dayAcum, dia) => {
                    if (dia.select) dayAcum.push(dia.day);
                    return dayAcum;
                }, []);

                this.taskNew.meses = mesesArray;
                this.taskNew.dias = dayArray;
                this.dateInitTaskNew = dateActual;
                this.dateEndTaskNew = dateActual;
            }
            if (this.taskNew.area === null) {
                this.showAlert('Debe elejir un area');
                return false;
            }
            if (this.taskNew.titulo.trim() === '') {
                this.showAlert('Titulo de actividad necesario');
                return false;
            }
            return true;
        },
        async createNewTask() {
            if (!this.validateDataNewTask()) return false;
            try {
                this.showOptionsTasks = false;

                this.setLoading(true);
                const infoExtra = this.taskNew.observaciones.trim() === '' ?
                    'Sin observaciones' :
                    this.taskNew.observaciones;
                const dateAction = this.getDateNow().format('YYYY-MM-DDTHH:MM:ss') + '.000z';
                const response = await axios({
                    method: 'post',
                    url: 'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/actividades',
                    data: {
                        id_master_task: this.taskNew.idMaster,
                        year_task: this.taskNew.year,
                        rango_fechas_task: this.taskNew.rangoFechas,
                        fecha_inicial_task: this.dateInitTaskNew,
                        fecha_final_task: this.dateEndTaskNew,
                        descripcion_task: this.taskNew.titulo,
                        observaciones_task: infoExtra,
                        mes_task: this.taskNew.meses,
                        dias_task: this.taskNew.dias,
                        para_area_task: this.taskNew.area,
                        estatus_task: this.taskNew.publica ? 'Pendiente' : 'Cancelada',
                        fecha_creada_task: dateAction,
                        creada_por_task: this.dataUser.data[0].UUID_user,
                        fecha_modificada_task: dateAction,
                        modificada_por_task: this.dataUser.data[0].UUID_user,
                    }
                })

                this.setLoading(false);
                console.log(response);

                if (response.data.success) {
                    this.reloadListTaskByIdMaster();
                    this.taskNew = {
                        idMaster: null,
                        rangoFechas: true,
                        dateInit: '',
                        dateEnd: '',
                        year: null,
                        area: null,
                        meses: [],
                        dias: [],
                        titulo: '',
                        observaciones: '',
                        publica: true,
                    }
                    this.showAlert(response.data.message, 'Exito', 'success');
                } else {
                    this.showAlert(response.data.message, 'Fallo al crear nueva actividad', 'warning');
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al crear actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        async deleteTask(idTask) {
            try {
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/actividades/' + idTask;

                this.setLoading(true);

                const response = await axios({
                    method: 'delete',
                    url,
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.reloadListTaskByIdMaster();
                    this.showAlert(response.data.message, 'Exito', 'success')
                } else {
                    this.showAlert(response.data.message, 'Fallo al eliminar actividad', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al eliminar actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },

        dontAviable() { this.showAlert('Accion no habilitada por el momento'); },
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
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al cargar areas intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
    },
})
