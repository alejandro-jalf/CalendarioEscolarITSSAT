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
            heightItemDia: 111,
            monthAndYear: 'Noviembre 2021',
            monthActual: null,
            showedTaskNext: false,
            widthWindow: 0,
            dateStart: null,
            dateEnd: null,
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
        styleHeight() {
            return 'height: ' + this.heightItemDia + 'px;'
        },
        refactorTasks() {
            const listTask = this.listTask.data.map((task) => {
                if (task.rango_fechas_task) {
                    task.fechas = [task.fecha_inicial_task]
                } else {
                    const fechas = []
                    task.mes_task.forEach((mes) => {
                        task.dias_task.forEach((dia) => {
                            fechas.push(
                                task.year_task +
                                '-' +
                                this.completeDateHour(mes) +
                                '-' +
                                this.completeDateHour(dia) +
                                'T00:00:00.000'
                            )
                        })
                    });
                    task.fechas = fechas;
                }
                return task;
            })
            return listTask;
        },
        isShowed() {
            return this.showedTaskNext ? 'icofont-bubble-left' : 'icofont-bubble-right'
        },
        sunday() {return this.widthWindow > 700 ? 'Domingo' : 'dom.'},
        monday() {return this.widthWindow > 700 ? 'Lunes' : 'lun.'},
        tuesday() {return this.widthWindow > 700 ? 'Martes' : 'mar.'},
        wednesday() {return this.widthWindow > 700 ? 'Miercoles' : 'mie.'},
        thursday() {return this.widthWindow > 700 ? 'Jueves' : 'jue.'},
        friday() {return this.widthWindow > 700 ? 'Viernes' : 'vie.'},
        saturday() {return this.widthWindow > 700 ? 'Sabado' : 'sab.'},
    },
    mounted() {
        this.widthWindow = window.innerWidth;
        if (!this.login) window.location.href = '../index.html';
        else {
            if (this.listTask.data.length === 0) this.loadTask();
            this.changeMonth();
            let widthBefore = window.innerWidth;
            window.addEventListener('resize', (evt) => {
                this.setHeightDia();
                this.widthWindow = window.innerWidth;
                if (
                    (this.widthWindow < 992 && widthBefore >= 992) ||
                    (this.widthWindow >= 992 && widthBefore < 992)
                ) {
                    if (this.widthWindow < 992) {
                        this.$refs.taskNext.style.left = '-250px';
                        this.showedTaskNext = false;
                    } else {
                        this.$refs.taskNext.style.left = '0px';
                        this.showedTaskNext = true;
                    }
                }
                widthBefore = window.innerWidth;
            });
        }
    },
    methods: {
        filterTasks(actividades) {
            const totalLetters = this.widthWindow < 530 ? 4 : 10;
            if (actividades.length > 3) {
                const tasks = [];
                for (let index = 0; index < 3; index++) {
                    // console.log(actividades[index]);
                    tasks.push(actividades[index].descripcion_task.slice(0, totalLetters));
                }
                return task;
            }
            return actividades.map((task) => task.descripcion_task.slice(0, totalLetters));
        },
        showTaskNext() {
            if (!this.showedTaskNext) this.$refs.taskNext.style.left = '0px';
            else this.$refs.taskNext.style.left = '-250px';
            this.showedTaskNext = !this.showedTaskNext;
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
        completeDateHour(number) {
            if (!number) return number
            const numberString = number.toString()
            if (numberString.length < 2) return '0' + number
            return number
        },
        setDates(start, end) {
            const startOfMonth = new moment(start);
            const endOfMonth = new moment(end);
            this.diasMesActual = [];
            const diaSemanaStart = startOfMonth.format('d');
            const diaSemanaEnd = parseInt(endOfMonth.format('d'));
            const diaMesEnd = parseInt(endOfMonth.format('DD'));
            let diaEndFor = parseInt(endOfMonth.format('DD'));

            const taskForMonth = this.refactorTasks.filter((task) => {
                return !!task.fechas.find((fecha) => {
                    const now = new moment(fecha);
                    return now >= startOfMonth && now <= endOfMonth;
                })
            });
            // console.log(taskForMonth);
            if (diaSemanaStart > 0) startOfMonth.add(-diaSemanaStart, 'days');
            if (diaSemanaEnd < 6) {
                endOfMonth.add((6 - diaSemanaEnd), 'days');
                diaEndFor += (6 - diaSemanaEnd)
            }
            
            let diaActual = startOfMonth;
            let semana =  []
            for (let dias = 0 - diaSemanaStart; dias < diaEndFor; dias++) {
                if (diaActual.format('d') === '0') semana = [];
                const actividades = taskForMonth.filter((task) => {
                    const dateFinded = task.fechas.find((dateN) => dateN.split('T')[0] === diaActual.format('YYYY-MM-DD'));
                    // console.log(dateFinded, diaActual.format('YYYY-MM-DD'), !!dateFinded);
                    return !!dateFinded;
                })
                semana.push({
                    dia: diaActual.format('DD'),
                    dias,
                    date: diaActual,
                    diaSemana: diaActual.format('d'),
                    diaMesEnd,
                    actividades,
                });
                if (diaActual.format('d') === '6') this.diasMesActual.push(semana);
                diaActual = diaActual.add(1, 'days')
            }
        },
        setHeightDia() {
            const nav = document.querySelector('.navbar');
            const headerTime = document.querySelector('.time-date');
            const headerDia = document.querySelector('.headerDia');

            const heightTotal = nav.clientHeight + headerTime.clientHeight + headerDia.clientHeight;
            const heightWindow = window.innerHeight;
            const heightItemDia = (heightWindow - heightTotal) / this.diasMesActual.length;
            this.heightItemDia = heightItemDia;
        },
        changeMonth(month) {
            if (!month) this.monthActual = moment().local(true);
            else this.monthActual = this.monthActual.add(month, 'M');

            const startOfMonth = new moment(this.monthActual.format('YYYY-MM-DD') + 'T00:00:00.000').startOf('month');
            const endOfMonth = new moment(this.monthActual.format('YYYY-MM-DD') + 'T23:59:59.999').endOf('month');

            const months = this.arrayMonths();
            this.monthAndYear = 
                months[startOfMonth.format('M') - 1] +
                ' ' +
                startOfMonth.format('YYYY');
            this.setDates(startOfMonth, endOfMonth);
            this.setHeightDia();
        },
        colorDia(dias, diaEnd) {
            return (dias < 0 || dias >= diaEnd) ? 'text-black-50' : 'text-dark fw-bold'
        },
        bgDia(dias, diaEnd) {
            return (dias < 0 || dias >= diaEnd) ? 'bg-light bg-opacity-75' : ''
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
