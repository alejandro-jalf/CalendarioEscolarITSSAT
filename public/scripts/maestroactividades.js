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
            arrayYearTasks: [],

            masterTask: localStorage.getItem('calendario_master_task') ?
                JSON.parse(localStorage.getItem('calendario_master_task')) :
                { data: [] },
            showOptionsMaster: false,
            statusMasterTask: 0,
            masterTaskActual: {},
            masterTaskActualEdit: {},
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
    },
    mounted() {
        this.widthWindow = window.innerWidth;
        if (!this.login) window.location.href = '../index.html';
        else {
            if (this.firtsSession === 'SI') {
                this.loadListTasks();
                sessionStorage.setItem('calendario_firts_session', 'NO');
            }

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
    },
})
