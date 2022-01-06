if (!sessionStorage.getItem('master_firts_session'))
    sessionStorage.setItem('master_firts_session', 'SI')
if (!localStorage.getItem('calendario_id_master_selected'))
    localStorage.setItem('calendario_id_master_selected', '')

var appAdministracion = new Vue({
    el: '#app',
    data() {
        return {
            login:  (typeof sessionStorage.getItem('calendario_p_login') === 'string') ?
                sessionStorage.getItem('calendario_p_login') === 'true' :
                sessionStorage.getItem('calendario_p_login'),
            dataUser: localStorage.getItem('calendario_data_user') ?
                JSON.parse(localStorage.getItem('calendario_data_user')) :
                { data: {}, empty: true },
            alert: {
                title: 'Advertencia',
                message: 'Any massage',
                type: 'warning',
                component: null,
            },
            alertOptions: {
                title: 'Advertencia',
                message: 'Any massage',
                type: 'warning',
                component: null,
                callBack: () => {},
            },
            loadingCount: 0,
            widthWindow: 0,
            firtsSession: sessionStorage.getItem('master_firts_session'),
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
        // Accesos
        accessToTasks() { return this.dataUser.data[0].accessTo_user.actividades.select },
        accessToMasters() { return this.dataUser.data[0].accessTo_user.maestroActividades.select },
        accessToAreas() { return this.dataUser.data[0].accessTo_user.areas.select },
        accessToUsers() { return this.dataUser.data[0].accessTo_user.usuarios.select },
        permissionToCreate() { return this.dataUser.data[0].accessTo_user.maestroActividades.create },
        permissionToUpdate() { return this.dataUser.data[0].accessTo_user.maestroActividades.update },
        permissionToDelete() { return this.dataUser.data[0].accessTo_user.maestroActividades.delete },

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
        backgroundHeaderOptions() {
            if (this.alertOptions.type === 'warning') return 'bg-warning';
            if (this.alertOptions.type === 'info') return 'bg-info';
            if (this.alertOptions.type === 'success') return 'bg-success';
            if (this.alertOptions.type === 'primary') return 'bg-primary';
            if (this.alertOptions.type === 'danger') return 'bg-danger';
            if (this.alertOptions.type === 'dark') return 'bg-dark';
            return 'bg-warning';
        },

        emptyMaster() {
            return this.masterTask.data.length === 0
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
        if (!this.login) window.location.replace('../views/login.html');
        else if (!this.accessToMasters) window.location.replace('../views/principal.html');
        else {
            if (this.firtsSession === 'SI') {
                this.loadPerfil();
                this.loadListTasks();
                sessionStorage.setItem('master_firts_session', 'NO');
            }

            const dateActual = this.getDateNow();
            const yearInitial = parseInt(dateActual.format('YYYY'));
            for (let index = 0; index < 5; index++) this.arrayYearTasks.push(yearInitial + index);

            window.addEventListener('resize', (evt) => { this.widthWindow = window.innerWidth; });
            
            let ss = 0;
            let timer;
            const second = () => {
                timer = setTimeout(second, 1000);
                if (ss >= 360) {
                    this.closeSession();
                    sessionStorage.setItem('calendario_session_expired', true)
                }
                ss++;
            }
            
            window.addEventListener('blur', (evt) => {
                ss = 0;
                second();
            });
            window.addEventListener('focus', (evt) => {
                ss = 0;
                clearTimeout(timer);
            });
        }
    },
    methods: {
        goToWindow(ref) { 
            if (ref && ref.trim() !== '#') window.location.replace(ref);
        },
        formatDate(dateString, hours = false) {
            const formatHours = hours ? ' HH:MM:ss' : '';
            const dateFromat = dateString.replace('z', '');
            const datef = new moment(dateFromat);
            const formatApply = datef.format(`DD/MM/YYYY ${formatHours}`);
            return formatApply;
        },
        closeSession() {
            this.login = false;
            sessionStorage.setItem('calendario_p_login', false);
            window.location.replace('../index.html');
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
        showAlertOptions(message, title = 'Advertencia', callBack = () => {}, type = 'warning') {
            this.alertOptions.title = title;
            this.alertOptions.message = message;
            this.alertOptions.type = type;
            this.alertOptions.callBack = callBack;

            this.$refs.btnAlertOptions.click()
        },

        statusMasterBorder(status) {
            return status ? 'cardTaskRealizada' : 'cardTaskCancelada';
        },
        showOptionsMasterClick() { this.showOptionsMaster = !this.showOptionsMaster; },
        listMasterTask() {
            this.statusMasterTask = 0;
        },
        newMasterTask() {
            if (this.permissionToCreate) {
                this.showOptionsMaster = false;
                this.statusMasterTask = 1;
                this.masterTaskActualEdit.titulo_master_task = '';
                this.masterTaskActualEdit.publicada_master_task = false;
            } else this.showAlert('No tienes permisos de creador');
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
        showInfoPublica() {
            this.showAlert(
                'El estado de "publica" tiene la finalidad de ocultar o mostrar toda una lista de actividades, por ejemplo si se encuentra como publica, todas las actividades incluidas dentro de esta lista maestro seran visibles en el calendario de actividades, en cambio si se encuentra desactivado ninguna actividad sera mostrada en el calendario, es recomendable dejarlo desactivado al momento de crear la lista maestro y hacerla publica hasta el momento que ya esten todas las actividades cargadas y verficada la informacion',
                'Informacion',
                'info'
            );
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
                this.setLoading(false);
                if (error.response !== undefined) {
                    if (error.response.data.message === 'No hay lista de actividades registradas') {
                        this.showAlert(error.response.data.message, 'Fallo al cargar las actividades', 'warning');
                        error.response.data.data = [];
                        localStorage.setItem(
                            'calendario_master_task',
                            JSON.stringify(error.response.data)
                        )
                        this.masterTask = error.response.data;
                    } else
                        this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                }
                else
                    this.showAlert('Fallo cargar las listas de actividades intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        validateNewMasterTask() {
            if (this.masterTaskActualEdit.titulo_master_task.trim() === '') {
                this.showAlert('Titulo no puede quedar vacio');
                return false;
            }
            if (this.masterTaskActualEdit.titulo_master_task.trim().length < 3) {
                this.showAlert('Titulo debe contener por lo menos 3 caracteres');
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
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al crear maestro actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        prepareUpdateMasterTask() {
            this.showAlertOptions(
                '¿Guardar cambios en lista maestro?',
                'Actualizando lista maestro',
                () => { this.updateMasterTask(); }
            );
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
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al actualizar maestro actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        prepareUpdatePublicaMaster(task, visible) {
            const message = visible ?
                '¿Quiere ocultar la lista de actividades?, Al aceptar la lista se ocultara del calendario de actividades.' :
                '¿Quiere mostrar la lista de actividades?, Al aceptar la lista se volvera visible en el calendario de actividades.';
            this.showAlertOptions(
                message,
                'Modificando visibilidad',
                () => { this.updatePublicaMasterTask(task); }
            );
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
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al actualizar maestro actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        prepareDeleteMasterTask(uuid_master_task) {
            this.showAlertOptions(
                '¿Quiere eliminar esta lista de actividades de manera permanente?',
                'Eliminando lista maestro',
                () => { this.deleteMasterTask(uuid_master_task); }
            );
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
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al eliminar maestro actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },

        // Actualizar perfil
        async loadPerfil() {
            try {
                this.showOptionsTasks = false;
                const user = this.dataUser.data[0].correo_user;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/usuarios/' + user;

                this.setLoading(true);

                const response = await axios({
                    method: 'get',
                    url,
                })

                this.setLoading(false);

                if (response.data.success) {
                    localStorage.setItem('calendario_data_user', JSON.stringify(response.data));
                    this.dataUser = response.data;
                    if (!response.data.data[0].activo_user) this.closeSession();
                } else {
                    this.showAlert(response.data.message, 'Fallo al recargar perfil', 'warning')
                }
            } catch (error) {
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'warning');
                else
                    this.showAlert('Fallo al recargar perfil intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
    },
})
