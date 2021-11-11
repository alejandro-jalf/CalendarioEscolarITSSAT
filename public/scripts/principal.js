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
            listTask: localStorage.getItem('calendario_list_task') ?
                JSON.parse(localStorage.getItem('calendario_list_task')) :
                { data: [] },
            alert: {
                title: 'Advertencia',
                message: 'Any massage',
                type: 'warning',
                component: null,
            },
            loading: false,
            diasMesActual: [],
        }
    },
    computed: {
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
    },
    mounted() {
        if (!this.login) window.location.href = '../index.html';
        else {
            if (this.listTask.data.length === 0) this.loadTask();
            // else console.log(this.listTask);
            // console.log(moment().local(true).format('DD/MM/YYYY HH:MM:SS'));
            this.setDates();
        }
    },
    methods: {
        setDates() {
            const startOfMonth = moment().local(true).startOf('month');
            const endOfMonth   = moment().local(true).endOf('month');
            const diaSemanaStart = startOfMonth.format('d');
            const diaSemanaEnd = parseInt(endOfMonth.format('d'));
            let diaEndFor = parseInt(endOfMonth.format('DD'));

            // console.log(diaEndFor, diaSemanaEnd);
            if (diaSemanaStart > 0) startOfMonth.add(-diaSemanaStart, 'days');
            if (diaSemanaEnd < 6) {
                endOfMonth.add((6 - diaSemanaEnd), 'days');
                diaEndFor += (6 - diaSemanaEnd)
            }
            
            // console.log(startOfMonth.date(), endOfMonth.date(), diaEndFor);
            let diaActual = startOfMonth;
            let semana =  []
            for (let dias = 0 - diaSemanaStart; dias < diaEndFor; dias++) {
                if (diaActual.format('d') === '0') semana = [];
                semana.push({
                    dia: diaActual.format('DD'),
                    dias,
                    date: diaActual,
                    diaSemana: diaActual.format('d'),
                });
                if (diaActual.format('d') === '6') this.diasMesActual.push(semana);
                diaActual = diaActual.add(1, 'days')
            }

            // console.log(this.diasMesActual, this.diasMesActual.length / 7);
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
        async loadTask() {
            try {
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/actividades';

                this.loading = true;

                const response = await axios({
                    method: 'get',
                    url,
                })

                this.loading = false;

                if (response.data.success) {
                    localStorage.setItem(
                        'calendario_list_task',
                        JSON.stringify(response.data)
                    )
                } else {
                    this.showAlert(response.data.message, 'Fallo en el inicio de sesion', 'warning')
                }
            } catch (error) {
                console.log(error, error.response);
                this.loading = false;
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                else
                    this.showAlert('Fallo cargar actividades intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
    },
})
