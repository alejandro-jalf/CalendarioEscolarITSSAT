if (!localStorage.getItem('calendario_p_login'))
    localStorage.setItem('calendario_p_login', false)

var appLogin = new Vue({
    el: '#app',
    data() {
        return {
            user_login: '',
            user_recovery: '',
            password_login: '',
            login: (typeof localStorage.getItem('calendario_p_login') === 'string') ?
                localStorage.getItem('calendario_p_login') === 'true' :
                localStorage.getItem('calendario_p_login'),
            alert: {
                title: 'Advertencia',
                message: 'Any massage',
                type: 'warning',
                component: null,
            },
            loading: false,
        }
    },
    computed: {
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
        if (this.login) window.location.href = './views/principal.html';
    },
    methods: {
        isLogin() {
            if (typeof localStorage.getItem('calendario_p_login') === 'string')
                return localStorage.getItem('calendario_p_login') === 'true'
            return localStorage.getItem('calendario_p_login')
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

                    console.log(response);
                    if (response.data.success) {
                        this.showAlert(response.data.message, 'Exito', 'success');
                        this.login = true;
                        localStorage.setItem('calendario_p_login', true)
                        window.location.href = './views/principal.html';
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
    },
})
