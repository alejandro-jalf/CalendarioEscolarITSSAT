if (!sessionStorage.getItem('calendario_p_login'))
    sessionStorage.setItem('calendario_p_login', false);

if (!sessionStorage.getItem('calendario_session_expired'))
    sessionStorage.setItem('calendario_session_expired', false);

var appLogin = new Vue({
    el: '#app',
    data() {
        return {
            user_login: '',
            user_recovery: '',
            password_login: '',
            login: (typeof sessionStorage.getItem('calendario_p_login') === 'string') ?
                sessionStorage.getItem('calendario_p_login') === 'true' :
                sessionStorage.getItem('calendario_p_login'),
            alert: {
                title: 'Advertencia',
                message: 'Any massage',
                type: 'warning',
                component: null,
            },
            loading: false,
            colorUser: 'text-light',
            colorPass: 'text-light',
            colorURec: 'text-light',
            viewPass: false,
            terminos: false,
            recuperandoCuenta: false,
            dataUser: localStorage.getItem('calendario_data_user') ?
                JSON.parse(localStorage.getItem('calendario_data_user')) :
                { data: {}, empty: true },
            sessionExpired: (typeof sessionStorage.getItem('calendario_session_expired') === 'string') ?
                sessionStorage.getItem('calendario_session_expired') === 'true' :
                sessionStorage.getItem('calendario_session_expired'),
        }
    },
    computed: {
        typePass() {
            return this.viewPass ? 'plain' : 'password'
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
    },
    mounted() {
        if (this.login) window.location.replace('../views/principal.html');
        else if (this.sessionExpired)
            this.showAlert(
                'Hemos cerrado tu sesion por seguridad, vuelve a acceder a tu cuenta de nuevo',
                'Sesion cerrada por inactividad',
                'danger'
            )
    },
    methods: {
        olvideMiPass() { this.recuperandoCuenta = true },
        backLogin() { this.recuperandoCuenta = false },
        focusUser() { this.colorUser = 'text-dark' },
        blurUser() { this.colorUser = 'text-light' },
        focusPass() { this.colorPass = 'text-dark' },
        blurPass() { this.colorPass = 'text-light' },
        focusURec() { this.colorURec = 'text-dark' },
        blurURec() { this.colorURec = 'text-light' },
        isLogin() {
            if (typeof sessionStorage.getItem('calendario_p_login') === 'string')
                return sessionStorage.getItem('calendario_p_login') === 'true'
            return sessionStorage.getItem('calendario_p_login')
        },
        showAlert(message, title = 'Advertencia', type = 'warning') {
            this.alert.title = title;
            this.alert.message = message;
            this.alert.type = type;

            this.$refs.btnAlert.click()
        },
        validateDataLogin() {
            if (this.user_login.trim() === '') {
                this.showAlert('Nombre de usuario no puede quedar vacio');
                return false;
            }
            if (this.password_login.trim() === '') {
                this.showAlert('Contraseña no puede quedar vacia');
                return false;
            }
            return true;
        },
        async loginUser() {
            if (this.validateDataLogin()) {
                try {
                    const url =
                        'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/usuarios/' +
                        this.user_login.trim() +
                        '/login';

                    this.loading = true;

                    const response = await axios({
                        method: 'post',
                        url,
                        data: {
                            password_user: this.password_login,
                        },
                    })

                    this.loading = false;

                    if (response.data.success) {
                        this.showAlert(response.data.message, 'Exito', 'success');
                        this.login = true;
                        sessionStorage.setItem('calendario_p_login', true)
                        localStorage.setItem(
                            'calendario_data_user',
                            JSON.stringify(response.data)
                        )
                        window.location.replace('../views/principal.html');
                    } else {
                        this.showAlert(response.data.message, 'Fallo en el inicio de sesion', 'warning')
                    }
                } catch (error) {
                    this.loading = false;
                    if (error.response !== undefined)
                        this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                    else
                        this.showAlert('Fallo al intentar iniciar sesion intentelo mas tarde', 'Error inesperado', 'danger');
                }
            }
        },
        validateDataRecovery() {
            if (this.user_recovery.trim() === '') {
                this.showAlert('Nombre de usuario no puede quedar vacio');
                return false;
            }
            return true;
        },
        async recoveryCount() {
            if (this.validateDataRecovery()) {
                try {
                    const url =
                    'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/usuarios/' +
                    this.user_recovery.trim() +
                    '/recovery';

                    this.loading = true;

                    const response = await axios({
                        method: 'put',
                        url,
                    })

                    this.loading = false;

                    if (response.data.success) {
                        this.showAlert(response.data.message, 'Exito', 'success');
                        this.recuperandoCuenta = false;
                    } else {
                        this.showAlert(response.data.message, 'Fallo en recuperacion de cuenta', 'warning')
                    }
                } catch (error) {
                    this.loading = false;
                    if (error.response !== undefined)
                        this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                    else
                        this.showAlert('Fallo al intentar recuperar su cuenta, intentelo mas tarde', 'danger');
                }
            }
        },
    },
})
