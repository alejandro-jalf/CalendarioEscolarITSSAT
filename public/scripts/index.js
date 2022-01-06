var appIndex = new Vue({
    el: '#app',
    data() {
        return {
            login:  (typeof sessionStorage.getItem('calendario_p_login') === 'string') ?
                sessionStorage.getItem('calendario_p_login') === 'true' :
                sessionStorage.getItem('calendario_p_login'),
        }
    },
    mounted() {
        if (!this.login) window.location.replace('./views/login.html');
        else window.location.replace('./views/principal.html');
    },
})