if (!sessionStorage.getItem('areas_firts_session'))
    sessionStorage.setItem('areas_firts_session', 'SI');

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
            alertOptions: {
                title: 'Advertencia',
                message: 'Any massage',
                type: 'warning',
                component: null,
                callBack: () => {},
            },
            loadingCount: 0,
            widthWindow: 0,
            firtsSession: sessionStorage.getItem('areas_firts_session'),
            areaNew: {
                maestro_area: null,
                nombre_area: '',
                activa_area: true,
            },
            newMasterArea: '',

            statusAreas: 0,
            listAreas: localStorage.getItem('calendario_areas_data') ?
                JSON.parse(localStorage.getItem('calendario_areas_data')) :
                { data: [] },
            showOptionsArea: false,
            detailsArea: {},
        }
    },
    computed: {
        // Accesos
        accessToTasks() { return this.dataUser.data[0].accessTo_user.actividades.select },
        accessToMasters() { return this.dataUser.data[0].accessTo_user.maestroActividades.select },
        accessToAreas() { return this.dataUser.data[0].accessTo_user.areas.select },
        accessToUsers() { return this.dataUser.data[0].accessTo_user.usuarios.select },
        permissionToCreate() { return this.dataUser.data[0].accessTo_user.areas.create },
        permissionToUpdate() { return this.dataUser.data[0].accessTo_user.areas.update },
        permissionToDelete() { return this.dataUser.data[0].accessTo_user.areas.delete },

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
        iconAreaFloat() {
            return this.showOptionsArea ? 'icofont-close' : 'icofont-ui-clip-board';
        },

        // Para areas
        titleCardArea() {
            return this.statusAreas === 1 ? 'Creando area' : 'Editando area'
        },
        areasRefactor() {
            return this.listAreas.data
        },
        emptyAreas() {
            return this.listAreas.data.length === 0
        },
        maestrosAreas() {
            return this.listAreas.data.reduce((acumMaster, area) => {
                if (area.maestro_area) acumMaster.push(area.maestro_area)
                return acumMaster
            }, [])
        },
        editandoCreadoArea() {
            return this.statusAreas === 1 || this.statusAreas === 2;
        },
    },
    mounted() {
        this.widthWindow = window.innerWidth;
        if (!this.login) window.location.href = '../index.html';
        else if (!this.accessToAreas) window.location.href = '../views/principal.html';
        else {
            if (this.firtsSession === 'SI') {
                this.loadPerfil();
                this.loadAreas();
                sessionStorage.setItem('areas_firts_session', 'NO');
            }
        }
    },
    methods: {
        formatDate(dateString, hours = false, am = false) {
            const formatHours = !hours ? '' :
                !am ? ' HH:MM' : ' hh:MM a';
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
        showAlertOptions(message, title = 'Advertencia', callBack = () => {}, type = 'warning') {
            this.alertOptions.title = title;
            this.alertOptions.message = message;
            this.alertOptions.type = type;
            this.alertOptions.callBack = callBack;

            this.$refs.btnAlertOptions.click()
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
        showOptionsAreaClick() { this.showOptionsArea = !this.showOptionsArea; },
        dontAviable() { this.showAlert('Accion no habilitada por el momento'); },

        // Methodos para areas
        viewArea(area) {
            this.detailsArea = area;
            this.statusAreas = 3;
            this.showOptionsArea = false;
        },
        formNewArea() {
            if (this.permissionToCreate) {
                this.statusAreas = 1;
                this.showOptionsArea = false;
                this.areaNew.maestro_area = null;
                this.areaNew.nombre_area = '';
                this.newMasterArea = '';
            } else this.showAlert('No tienes permisos de creador');
        },
        refactorStatus(status) {
            return status ? 'Habilitada' : 'Deshabilitada';
        },
        reloadAreas() {
            this.loadAreas();
            this.showOptionsArea = false;
        },
        async loadAreas() {
            try {
                this.showOptionsArea = false;
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
                    this.showAlert(response.data.message, 'Fallo al cargar las areas', 'warning');
                }
            } catch (error) {
                this.setLoading(false);
                if (error.response !== undefined) {
                    if (error.response.data.message === 'No hay areas registradas') {
                        this.showAlert(error.response.data.message, 'Fallo al cargar las areas', 'warning');
                        error.response.data.data = [];
                        localStorage.setItem(
                            'calendario_areas_data',
                            JSON.stringify(error.response.data)
                        )
                        this.listAreas = error.response.data;
                    } else
                        this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                } else
                    this.showAlert('Fallo al cargar areas intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        validateDataArea() {
            if (this.areaNew.maestro_area === 'newMasterArea') {
                if (this.newMasterArea.trim() === '') {
                    this.showAlert('Necesita ingresar el nombre general del area');
                    return false
                }
                this.areaNew.maestro_area = this.newMasterArea.trim().toUpperCase()
            } else {
                if (this.areaNew.maestro_area === null) {
                    this.showAlert('Necesita seleccionar un maestro area');
                    return false
                }
            }
            if (this.areaNew.nombre_area.trim() === '') {
                this.showAlert('Necesita ingresar el nombre del area');
                return false
            }
            return true
        },
        async createNewArea() {
            if (!this.validateDataArea()) return false;
            try {
                this.showOptionsArea = false;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/areas';

                this.setLoading(true);

                const dateActual = this.getDateNow().format('YYYY-MM-DDTHH:MM:ss') + '.000z';

                const response = await axios({
                    method: 'post',
                    url,
                    data: {
                        maestro_area: this.areaNew.maestro_area,
                        nombre_area: this.areaNew.nombre_area,
                        fecha_creada_area: dateActual,
                        creada_por_area: this.dataUser.data[0].UUID_user,
                        fecha_modificada_area: dateActual,
                        modificada_por_area: this.dataUser.data[0].UUID_user,
                    }
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito en la creacion', 'success');
                    this.loadAreas();
                    this.statusAreas = 0;
                    this.areaNew.maestro_area = null;
                    this.areaNew.nombre_area = '';
                    this.newMasterArea = '';
                } else {
                    this.showAlert(response.data.message, 'Fallo al crear area', 'warning')
                }
            } catch (error) {
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al crear area intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        setDataForEdit(area) {
            const dataActual = { ...area }
            this.areaNew = dataActual;
            this.statusAreas = 2;
        },
        prepareForUpdate(idArea) {
            this.showAlertOptions(
                `¿Quiere guardar los cambios en el area?`,
                'Actualizando area',
                () => { this.updateDataArea(idArea); }
            );
        },
        async updateDataArea(idArea) {
            if (!this.validateDataArea()) return false;
            try {
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/areas/' + idArea;

                this.setLoading(true);

                const dateActual = this.getDateNow().format('YYYY-MM-DDTHH:MM:ss') + '.000z';

                const response = await axios({
                    method: 'put',
                    url,
                    data: {
                        maestro_area: this.areaNew.maestro_area,
                        nombre_area: this.areaNew.nombre_area,
                        fecha_modificada_area: dateActual,
                        modificada_por_area: this.dataUser.data[0].UUID_user,
                        activa_area: this.areaNew.activa_area,
                    }
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito en la actualizacion', 'success');
                    this.loadAreas();
                    this.statusAreas = 0;
                    this.areaNew.maestro_area = null;
                    this.areaNew.nombre_area = '';
                    this.newMasterArea = '';
                    this.showOptionsArea = false;
                } else {
                    this.showAlert(response.data.message, 'Fallo al actualizar area', 'warning')
                }
            } catch (error) {
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al actualizar area intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        prepareForUpdateStatus(idArea, actividad) {
            const statusNew = actividad ? 'deshabilitada' : 'habilitada';
            this.showAlertOptions(
                `¿Quiere cambiar el estatus del area a ${statusNew}?`,
                'Actualizando estatus area',
                () => { this.updateStatusArea(idArea, actividad); }
            );
        },
        async updateStatusArea(idArea, actividad) {
            try {
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/areas/' + idArea +'/activa';

                this.setLoading(true);

                const response = await axios({
                    method: 'put',
                    url,
                    data: { activa_area: !actividad }
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito en la actualizacion', 'success');
                    this.loadAreas();
                } else {
                    this.showAlert(response.data.message, 'Fallo al actualizar area', 'warning')
                }
            } catch (error) {
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al actualizar area intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
        prepareForDelete(idArea, nombre) {
            this.showAlertOptions(
                `¿Quiere eliminar el area "${nombre}" de manera permanente?`,
                'Eliminando area',
                () => { this.deleteArea(idArea); }
            );
        },
        async deleteArea(idArea) {
            try {
                this.showOptionsArea = false;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/areas/' + idArea;

                this.setLoading(true);

                const response = await axios({
                    method: 'delete',
                    url,
                })

                this.setLoading(false);

                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito al eliminar', 'success');
                    this.loadAreas();
                } else {
                    this.showAlert(response.data.message, 'Fallo al eliminar area', 'warning')
                }
            } catch (error) {
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al elimnar area intentelo mas tarde', 'Error inesperado', 'danger');
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
