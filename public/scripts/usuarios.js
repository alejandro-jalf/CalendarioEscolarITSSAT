if (!sessionStorage.getItem('users_firts_session'))
    sessionStorage.setItem('users_firts_session', 'SI')

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
            firtsSession: sessionStorage.getItem('users_firts_session'),
            shiftSelected: false,

            userNew: {
                correo_user: '',
                nombre_user: '',
                apellid_p_user: '',
                apellid_m_user: '',
                direccion_user: '',
                telefono_user: '',
                ciudad_user: '',
                password_user: '',
                password_r_user: '',
                tipo_user: 'invitado',
                area_user: null,
                activo_user: true,
                accessTo_user: {
                    principal: {
                        select: true,
                        view: true
                    },
                    maestroActividades: {
                        select: false,
                        view: true,
                        create: false,
                        update: false,
                        delete: false
                    },
                    actividades: {
                        select: false,
                        view: true,
                        create: false,
                        update: false,
                        delete: false
                    },
                    areas: {
                        select: false,
                        view: true,
                        create: false,
                        update: false,
                        delete: false
                    },
                    usuarios: {
                        select: false,
                        view: true,
                        create: false,
                        update: false,
                        delete: false
                    },
                    perfil: {
                        select: true,
                        view: true,
                        update: true
                    },
                }
            },
            showOptionsUsers: false,
            statusUser: 0, //0 = lista, 1 = creando, 2 = Editando, 3 = Visualizar
            detailsUser: {},
            dataUsers: localStorage.getItem('calendario_users') ?
                JSON.parse(localStorage.getItem('calendario_users')) :
                { data: [] },
            dataAreas: localStorage.getItem('calendario_areas_data') ?
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
        backgroundHeaderOptions() {
            if (this.alertOptions.type === 'warning') return 'bg-warning';
            if (this.alertOptions.type === 'info') return 'bg-info';
            if (this.alertOptions.type === 'success') return 'bg-success';
            if (this.alertOptions.type === 'primary') return 'bg-primary';
            if (this.alertOptions.type === 'danger') return 'bg-danger';
            if (this.alertOptions.type === 'dark') return 'bg-dark';
            return 'bg-warning';
        },

        // Para actividades
        selectAllTask() {
            return (
                this.userNew.accessTo_user.actividades.create &&
                this.userNew.accessTo_user.actividades.update &&
                this.userNew.accessTo_user.actividades.delete
            );
        },
        selectAllMaster() {
            return (
                this.userNew.accessTo_user.maestroActividades.create &&
                this.userNew.accessTo_user.maestroActividades.update &&
                this.userNew.accessTo_user.maestroActividades.delete
            );
        },
        selectAllAreas() {
            return (
                this.userNew.accessTo_user.areas.create &&
                this.userNew.accessTo_user.areas.update &&
                this.userNew.accessTo_user.areas.delete
            );
        },
        selectAllUser() {
            return (
                this.userNew.accessTo_user.usuarios.create &&
                this.userNew.accessTo_user.usuarios.update &&
                this.userNew.accessTo_user.usuarios.delete
            );
        },
        isManagerSelected() {
            return this.userNew.tipo_user === 'administrador'
        },
        isInvitedSelected() {
            return this.userNew.tipo_user === 'invitado'
        },
        messageInvalidPassword() {
            if (this.userNew.password_user.trim().length < 6) return 'La contraseña debe ser mayor de 6 caracteres';

            const expresionLetters = new RegExp('[a-z]|[A-Z]');
            if (!expresionLetters.test(this.userNew.password_user)) return 'La contraseña debe contener al menos una letra';
            
            const expresionNumbers = new RegExp('\\d+');
            if (!expresionNumbers.test(this.userNew.password_user)) return 'La contraseña debe contener al menos un numero';
            return '';
        },
        isValidPassword() {
            if (this.userNew.password_user.trim().length < 6) return 'is-invalid';

            const expresionLetters = new RegExp('[a-z]|[A-Z]')
            const expresionNumbers = new RegExp('\\d+')

            return (
                expresionLetters.test(this.userNew.password_user) &&
                expresionNumbers.test(this.userNew.password_user)
            ) ? 'is-valid' : 'is-invalid';
        },
        isValidPasswordRepeat() {
            return (
                this.userNew.password_user.trim() ===
                this.userNew.password_r_user.trim()
            ) ? 'is-valid' : 'is-invalid';
        },
        editandoCreandoUser() {
            return this.statusUser === 1 || this.statusUser === 2;
        },
        styleFloat() {
            return this.statusUser === 0 ? 'opacity: 1.0; right: 20pt;' : 'opacity: 0.0; right: 15pt;';
        },
        iconTasksFloat() {
            return this.showOptionsUsers ? 'icofont-close' : 'icofont-sub-listing';
        },
        styleFloatTasks() {
            return this.showOptionsUsers ? 'opacity: 1.0; right: 20pt; background: rgb(2, 138, 21);' : 'opacity: 0.0; right: 15pt; background: rgba(0, 0, 0, 0);';
        },
        styleFloatTasksSecond() {
            return this.showOptionsUsers ? 'opacity: 1.0; right: 20pt; background: rgb(0, 55, 138);' : 'opacity: 0.0; right: 15pt; background: rgba(0, 0, 0, 0);';
        },
        listDataUsers() {
            return this.dataUsers.data
                .sort((a, b) => new moment(a.fecha_alta_user.replace('z', '')) < new moment(b.fecha_alta_user.replace('z', '')) ? 1 : -1);
        },
        emptyUsers() {
            return this.dataUsers.data.length === 0
        },
        titleCardUser() {
            return this.statusUser === 1 ? 'Creando usuario' : 'Editando usuario'
        },
        activoUser() {
            return this.userNew.activo_user ? 'Cuenta activa' : 'Cuenta deshabilitada';
        },

        listDataAreas() {
            return this.dataAreas.data
                .sort((a, b) => new moment(a.fecha_creada_area.replace('z', '')) < new moment(b.fecha_creada_area.replace('z', '')) ? 1 : -1);
        },
    },
    mounted() {
        this.widthWindow = window.innerWidth;
        if (!this.login) window.location.href = '../index.html';
        else {
            if (this.firtsSession === 'SI') {
                this.loadAreas();
                this.loadUsers();
                sessionStorage.setItem('users_firts_session', 'NO');
            }
            
            window.addEventListener('keyup', (evt) => {
                if (evt.key === 'Shift') this.shiftSelected = false;
            });
            window.addEventListener('keydown', (evt) => {
                if (evt.key === 'Shift') this.shiftSelected = true;
            });
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

        // Para actividades
        iconToggle(status) {
            return status ? 'icofont-toggle-on text-success fs-1' : 'icofont-toggle-off text-danger fs-1';
        },
        isEqualsUser(uuidUser) {
            return this.dataUser.data[0].UUID_user === uuidUser;
        },
        selectInvitadoUser() {
            if (this.userNew.tipo_user === 'invitado') {
                this.userNew.accessTo_user.usuarios.select = false;
                this.userNew.accessTo_user.usuarios.view = false;
                this.userNew.accessTo_user.usuarios.create = false;
                this.userNew.accessTo_user.usuarios.update = false;
                this.userNew.accessTo_user.usuarios.delete = false;
                this.userNew.accessTo_user.areas.view = true;
                this.userNew.accessTo_user.areas.create = false;
                this.userNew.accessTo_user.areas.update = false;
                this.userNew.accessTo_user.areas.delete = false;
                this.userNew.accessTo_user.actividades.view = true;
                this.userNew.accessTo_user.actividades.create = false;
                this.userNew.accessTo_user.actividades.update = false;
                this.userNew.accessTo_user.actividades.delete = false;
                this.userNew.accessTo_user.maestroActividades.view = true;
                this.userNew.accessTo_user.maestroActividades.create = false;
                this.userNew.accessTo_user.maestroActividades.update = false;
                this.userNew.accessTo_user.maestroActividades.delete = false;
            }

            if (this.userNew.tipo_user === 'administrador' || this.userNew.tipo_user === 'ejecutivo') {
                this.userNew.accessTo_user.usuarios.select = false;
                this.userNew.accessTo_user.usuarios.view = true;
                this.userNew.accessTo_user.usuarios.create = false;
                this.userNew.accessTo_user.usuarios.update = false;
                this.userNew.accessTo_user.usuarios.delete = false;
            }
        },
        changeAllAreas() {
            const checkedAll = this.$refs.checkAreasAll.checked;
            this.userNew.accessTo_user.areas.create = checkedAll;
            this.userNew.accessTo_user.areas.update = checkedAll;
            this.userNew.accessTo_user.areas.delete = checkedAll;
        },
        changeAllTask() {
            const checkedAll = this.$refs.checkTaskAll.checked;
            this.userNew.accessTo_user.actividades.create = checkedAll;
            this.userNew.accessTo_user.actividades.update = checkedAll;
            this.userNew.accessTo_user.actividades.delete = checkedAll;
        },
        changeAllMaster() {
            const checkedAll = this.$refs.checkMasterAll.checked;
            this.userNew.accessTo_user.maestroActividades.create = checkedAll;
            this.userNew.accessTo_user.maestroActividades.update = checkedAll;
            this.userNew.accessTo_user.maestroActividades.delete = checkedAll;
        },
        changeAllUsers() {
            const checkedAll = this.$refs.checkUserAll.checked;
            this.userNew.accessTo_user.usuarios.create = checkedAll;
            this.userNew.accessTo_user.usuarios.update = checkedAll;
            this.userNew.accessTo_user.usuarios.delete = checkedAll;
        },
        infoTipeUser() {
            this.showAlert(
                'El tipo de usuario corresponde el nivel de acceso que puede tener un usuario determinado, por ejemplo el usuario invitado, solo podra hacer lecturas de las pestañas a las que se le de acceso, por otro lado el usuario ejecutivo podra realizar mas acciones que solo lectura de las pestañas que se le de autorizacion, y por ultimo el usuario administrador es similar al ejecutvio, a diferencia que este podra realizar acciones en usuarios segun los permisos y accesos que tenga. Puede ver los cambios en "Permisos y accesos" al cambiar de usuario',
                'Tipos de usuario',
                'info'
            )
        },
        refactorStatus(status) {
            return status ? 'Activo' : 'Inactivo';
        },
        newUser() {
            this.statusUser = 1;
            this.showOptionsUsers = false;
            this.userNew = {
                correo_user: '',
                nombre_user: '',
                apellid_p_user: '',
                apellid_m_user: '',
                direccion_user: '',
                telefono_user: '',
                ciudad_user: '',
                password_user: '',
                password_r_user: '',
                tipo_user: 'invitado',
                area_user: null,
                accessTo_user: {
                    principal: {
                        select: true,
                        view: true
                    },
                    maestroActividades: {
                        select: false,
                        view: true,
                        create: false,
                        update: false,
                        delete: false
                    },
                    actividades: {
                        select: false,
                        view: true,
                        create: false,
                        update: false,
                        delete: false
                    },
                    areas: {
                        select: false,
                        view: true,
                        create: false,
                        update: false,
                        delete: false
                    },
                    usuarios: {
                        select: false,
                        view: true,
                        create: false,
                        update: false,
                        delete: false
                    },
                    perfil: {
                        select: true,
                        view: true,
                        update: true
                    },
                }
            };
        },
        showOptionsUsersClick() { this.showOptionsUsers = !this.showOptionsUsers;},
        
        async loadUsers() {
            try {
                this.showOptionsUsers = false;
                const url = 'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/usuarios';

                this.setLoading(true);

                const response = await axios({
                    method: 'get',
                    url,
                })

                this.setLoading(false);

                console.log(response);
                if (response.data.success) {
                    localStorage.setItem('calendario_users', JSON.stringify(response.data));
                    this.dataUsers = response.data;
                } else {
                    this.showAlert(response.data.message, 'Fallo al cargar los usuarios', 'warning')
                }
            } catch (error) {
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al cargar los usuarios intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },

        setDetailsUser(data) {
            const dataActual = { ...data };
            console.log(dataActual);
            this.statusUser = 3;
            this.detailsUser = dataActual;
            this.showOptionsUsers = false;
        },

        validateDataUser() {
            if (this.statusUser === 1) {
                if (this.userNew.correo_user.trim() === '') {
                    this.showAlert('Necesita ingresar el correo electronico');
                    return false;
                }
    
                const correo_split = this.userNew.correo_user.trim().split('@');
                if (correo_split[1].trim() !== 'itssat.edu.mx') {
                    this.showAlert(`El correo "${this.userNew.correo_user}" no pertenece a un dominio autorizado`);
                    return false;
                }
            }

            if (this.userNew.nombre_user.trim() === '') {
                this.showAlert('Nombre no puede quedar vacio');
                return false;
            }
            if (this.userNew.apellid_p_user.trim() === '') {
                this.showAlert('Se necesita ingresar el apellido paterno');
                return false;
            }
            if (this.userNew.apellid_m_user.trim() === '') {
                this.showAlert('Se necesita ingresar el apellido materno');
                return false;
            }
            if (this.userNew.direccion_user.trim() === '') {
                this.showAlert('Direccion es requerida');
                return false;
            }
            if (this.userNew.telefono_user.trim() === '') {
                this.showAlert('Telefono de usuario es necesario');
                return false;
            }
            if (this.userNew.ciudad_user.trim() === '') {
                this.showAlert('Ciudad no puede ser vacio');
                return false;
            }

            if (this.statusUser === 1) {
                if (this.userNew.password_user.trim() === '') {
                    this.showAlert('Contraseña no puede ser vacia');
                    return false;
                }
    
                const expresionLetters = new RegExp('[a-z]|[A-Z]');
                if (!expresionLetters.test(this.userNew.password_user)) {
                    this.showAlert('La contraseña debe contener al menos una letra');
                    return false;
                }
    
                const expresionNumbers = new RegExp('\\d+');
                if (!expresionNumbers.test(this.userNew.password_user)) {
                    this.showAlert('La contraseña debe contener al menos un numero');
                    return false;
                }
    
                if (this.userNew.password_user.trim().length < 6) {
                    this.showAlert('La contraseña debe ser mayor de 6 caracteres');
                    return false;
                }
    
                if (this.userNew.password_r_user.trim() !== this.userNew.password_user.trim()) {
                    this.showAlert('Contraseñas no coinciden');
                    return false;
                }
            }

            if (this.userNew.area_user === null) {
                this.showAlert('Necesita elejir un area');
                return false;
            }
            return true;
        },

        async createUser() {
            if (!this.validateDataUser()) return false;
            try {
                this.showOptionsUsers = false;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/usuarios';

                this.setLoading(true);
                const dateAction = this.getDateNow().format('YYYY-MM-DDTHH:MM:ss') + '.000z';

                const response = await axios({
                    method: 'post',
                    url,
                    data: {
                        correo_user: this.userNew.correo_user,
                        nombre_user: this.userNew.nombre_user,
                        apellid_p_user: this.userNew.apellid_p_user,
                        apellid_m_user: this.userNew.apellid_m_user,
                        direccion_user: this.userNew.direccion_user,
                        telefono_user: this.userNew.telefono_user,
                        ciudad_user: this.userNew.ciudad_user,
                        password_user: this.userNew.password_user,
                        tipo_user: this.userNew.tipo_user,
                        area_user: this.userNew.area_user,
                        accessTo_user: this.userNew.accessTo_user,
                        fecha_alta_user: dateAction,
                        creado_por_user: this.dataUser.data[0].UUID_user,
                        fecha_modificacion_user: dateAction,
                        modificado_por_user: this.dataUser.data[0].UUID_user,
                    },
                })

                this.setLoading(false);

                console.log(response);
                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito', 'success');
                    this.loadUsers();
                    this.statusUser = 0;
                } else {
                    this.showAlert(response.data.message, 'Fallo al crear usuario', 'warning');
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined) {
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                } else
                    this.showAlert('Fallo al crear usuario intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },

        setDataForUpdate(data) {
            const dataActual = { ...data };
            dataActual.area_user = dataActual.area_user.uuid
            console.log(dataActual);
            this.statusUser = 2;
            this.userNew = dataActual;
            this.showOptionsUsers = false;
        },

        questionUpdate() {
            this.showAlertOptions(
                '¿Guardar cambios en el usuario?',
                'Actualizando usuario',
                () => { this.updateUser(); }
            );
        },
        async updateUser() {
            if (!this.validateDataUser()) return false;
            try {
                this.showOptionsUsers = false;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/usuarios/' + this.userNew.correo_user;

                this.setLoading(true);
                const dateAction = this.getDateNow().format('YYYY-MM-DDTHH:MM:ss') + '.000z';

                const response = await axios({
                    method: 'put',
                    url,
                    data: {
                        nombre_user: this.userNew.nombre_user,
                        apellid_p_user: this.userNew.apellid_p_user,
                        apellid_m_user: this.userNew.apellid_m_user,
                        direccion_user: this.userNew.direccion_user,
                        telefono_user: this.userNew.telefono_user,
                        ciudad_user: this.userNew.ciudad_user,
                        tipo_user: this.userNew.tipo_user,
                        area_user: this.userNew.area_user,
                        accessTo_user: this.userNew.accessTo_user,
                        activo_user: this.userNew.activo_user,
                        fecha_modificacion_user: dateAction,
                        modificado_por_user: this.dataUser.data[0].UUID_user,
                    },
                })

                this.setLoading(false);

                console.log(response);
                if (response.data.success) {
                    this.showAlert(response.data.message, 'Exito', 'success');
                    this.loadUsers();
                    this.statusUser = 0;
                } else {
                    this.showAlert(response.data.message, 'Fallo al actualizar usuario', 'warning');
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined) {
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                } else
                    this.showAlert('Fallo al actualizar usuario intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },

        setForDelete(idTask) {
            this.showAlertOptions(
                '¿Quiere eliminar esta actividad de manera permanente?',
                'Eliminando Actividad',
                () => { this.deleteTask(idTask); }
            );
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
                this.setLoading(false);
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo al eliminar actividad intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },

        dontAviable() { this.showAlert('Accion no habilitada por el momento'); },
        
        async loadAreas() {
            try {
                this.showOptionsUsers = false;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/areas';

                this.setLoading(true);

                const response = await axios({
                    method: 'get',
                    url,
                })

                this.setLoading(false);

                console.log(response);
                if (response.data.success) {
                    localStorage.setItem(
                        'calendario_areas_data',
                        JSON.stringify(response.data)
                    )
                    this.dataAreas = response.data;
                } else {
                    this.showAlert(response.data.message, 'Fallo al cargar las areas', 'warning');
                }
            } catch (error) {
                console.log(error, error.response);
                this.setLoading(false);
                if (error.response !== undefined) {
                    if (error.response.data.message === 'No hay areas registradas') {
                        this.showAlert(error.response.data.message, 'Fallo al cargar las areas', 'warning');
                        error.response.data.data = [];
                        localStorage.setItem(
                            'calendario_areas_data',
                            JSON.stringify(error.response.data)
                        )
                        this.dataAreas = error.response.data;
                    } else
                        this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                } else
                    this.showAlert('Fallo al cargar areas intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
    },
})
