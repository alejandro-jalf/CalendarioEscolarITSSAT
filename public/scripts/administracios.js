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
            masterTask: localStorage.getItem('calendario_master_task') ?
                JSON.parse(localStorage.getItem('calendario_master_task')) :
                { data: [] },
            alert: {
                title: 'Advertencia',
                message: 'Any massage',
                type: 'warning',
                component: null,
            },
            loadingCount: 0,
            widthWindow: 0,
            statusMasterTask: 0,
            masterTaskActual: {},
            masterTaskActualEdit: {},
        }
    },
    computed: {
        descriptionActionMasterTask() {
            return this.statusMasterTask === 1 ? 'Creando nueva lista maestro' : 'Editando lista maestro';
        },
        createEditMasterTask() {
            return this.statusMasterTask === 1 || this.statusMasterTask === 3
        },
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
        masterTaskRefactor() {
            return this.masterTask.data;
        },
    },
    mounted() {
        this.widthWindow = window.innerWidth;
        if (!this.login) window.location.href = '../index.html';
        else {
            console.log(this.dataUser, this.getDateNow());
            this.loadListTasks();
            // let widthBefore = window.innerWidth;
            // window.addEventListener('resize', (evt) => {
            //     this.setHeightDia();
            //     this.widthWindow = window.innerWidth;
            //     if (
            //         (this.widthWindow < 992 && widthBefore >= 992) ||
            //         (this.widthWindow >= 992 && widthBefore < 992)
            //     ) {
            //         if (this.widthWindow < 992) {
            //             this.$refs.taskNext.style.left = '-250px';
            //             this.showedTaskNext = false;
            //         } else {
            //             this.$refs.taskNext.style.left = '0px';
            //             this.showedTaskNext = true;
            //         }
            //     }
            //     widthBefore = window.innerWidth;
            // });
        }
    },
    methods: {
        getDateNow() {
            return new moment().local(true)
        },
        listMasterTask() {
            this.statusMasterTask = 0;
        },
        newMasterTask() {
            this.statusMasterTask = 1;
            this.masterTaskActualEdit.titulo_master_task = '';
            this.masterTaskActualEdit.publicada_master_task = false;
        },
        detailsMasterTask(task) {
            this.masterTaskActual = task;
            this.statusMasterTask = 2;
        },
        editMasterTask(task) {
            console.log(task.titulo_master_task);
            this.masterTaskActual = task;
            const title = this.masterTaskActual.titulo_master_task;
            const state = this.masterTaskActual.publicada_master_task;
            
            this.masterTaskActualEdit.titulo_master_task = title;
            this.masterTaskActualEdit.publicada_master_task = state;
            this.statusMasterTask = 3;
        },
        setLoading(visible = false) {
            if (visible) this.loadingCount ++;
            else this.loadingCount --;
            if (this.loadingCount) this.loadingCount = 0;
        },
        showAlert(message, title = 'Advertencia', type = 'warning') {
            this.alert.title = title;
            this.alert.message = message;
            this.alert.type = type;

            this.$refs.btnAlert.click()
        },
        closeSession() {
            this.login = false;
            localStorage.setItem('calendario_p_login', false);
            window.location.href = '../index.html';
        },
        refactorStatus(status) {
            return status ? 'Publicada' : 'Privada';
        },
        formatDate(dateString, hours = false) {
            const formatHours = hours ? ' HH:MM:SS' : '';
            return new moment(dateString.replace('z', '')).format(`DD/MM/YYYY ${formatHours}`);
        },
        async loadListTasks() {
            try {
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/maestroactividades';

                this.setLoading(true);

                const response = await axios({
                    method: 'get',
                    url,
                })

                this.setLoading(false);
                console.log(response.data);

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

                const response = await axios({
                    method: 'post',
                    url,
                    data: {
                        titulo_master_task: this.masterTaskActualEdit.titulo_master_task,
                        publicada_master_task: this.masterTaskActualEdit.publicada_master_task,
                        fecha_creada_master_task: this.getDateNow().format('YYYY-MM-DDTHH:MM:SS') + '.000z',
                        creada_por_master_task: this.dataUser.data[0].UUID_user,
                        fecha_modificada_master_task: this.getDateNow().format('YYYY-MM-DDTHH:MM:SS') + '.000z',
                        modificada_por_master_task: this.dataUser.data[0].UUID_user,
                    },
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito', 'success');
                    this.loadListTasks();
                    this.listMasterTask();
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
    },
})
