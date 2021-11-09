var appPrincipal = new Vue({
    el: '#app',
    data() {
        return {
            login:  (typeof localStorage.getItem('calendario_p_login') === 'string') ?
            localStorage.getItem('calendario_p_login') === 'true' :
            localStorage.getItem('calendario_p_login'),
            dataUser: localStorage.getItem('calendario_data_user') ?
                JSON.parse(localStorage.getItem('calendario_data_user')) :
                { data: {}, empty: true },
        }
    },
    computed: {
        apodo() {
            return this.dataUser.data[0].nombre_user
        },
    },
    mounted() {
        if (!this.login) window.location.href = '../index.html';
    },
    methods: {
        closeSession() {
            this.login = false;
            localStorage.setItem('calendario_p_login', false);
            window.location.href = '../index.html';
        }
    },
})
