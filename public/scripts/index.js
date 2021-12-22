var appIndex = new Vue({
    el: '#app',
    data() {
        return {
            login:  (typeof localStorage.getItem('calendario_p_login') === 'string') ?
                localStorage.getItem('calendario_p_login') === 'true' :
                localStorage.getItem('calendario_p_login'),
        }
    },
    mounted() {
        if (!this.login) window.location.replace('./views/login.html');
        else window.location.replace('./views/principal.html');
    },
})