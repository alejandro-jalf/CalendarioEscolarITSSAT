if (!sessionStorage.getItem('calendario_firts_session'))
    sessionStorage.setItem('calendario_firts_session', 'SI');

var appPrincipal = new Vue({
    el: '#app',
    data() {
        return {
            login:  (typeof sessionStorage.getItem('calendario_p_login') === 'string') ?
                sessionStorage.getItem('calendario_p_login') === 'true' :
                sessionStorage.getItem('calendario_p_login'),
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
            dateNow: new moment().local(true),
            detailsTask: {},
            showDetails: false,
            firtsSession: sessionStorage.getItem('calendario_firts_session'),
            showListTask: false,
            listTaskForDay: [],
            dayListTask: '',
        }
    },
    computed: {
        // Accesos
        accessToTasks() { return this.dataUser.data[0].accessTo_user.actividades.select },
        accessToMasters() { return this.dataUser.data[0].accessTo_user.maestroActividades.select },
        accessToAreas() { return this.dataUser.data[0].accessTo_user.areas.select },
        accessToUsers() { return this.dataUser.data[0].accessTo_user.usuarios.select },

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
        taskProximas() {
            const now = this.dateNow;
            const dateEnd = new moment(now).add(25, 'days');
            const tasks =  this.refactorTasks.filter((task) => {
                const dateValid = task.fechas.find((fecha) => {
                    const fechaMoment = new moment(fecha.replace('z', ''));
                    return fechaMoment >= now && fechaMoment <= dateEnd;
                })
                if (dateValid) {
                    task.next = new moment(dateValid.replace('z', '')).format('DD/MM/YYYY');
                    task.nextLetters = dateValid.replace('z', '');
                }
                return !!dateValid;
            });
            return tasks.sort((a, b) => new moment(a.nextLetters) < new moment(b.nextLetters) ? -1 : 1);
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
            });
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
        if (!this.login) window.location.replace('../views/login.html');
        else {
            if (this.firtsSession === 'SI') {
                this.loadPerfil();
                this.loadTask();
                sessionStorage.setItem('calendario_firts_session', 'NO');
            }
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

            let ss = 0;
            let timer;
            const second = () => {
                timer = setTimeout(second, 1000);
                if (ss >= 360) {
                    this.closeSession();
                    sessionStorage.setItem('calendario_session_expired', true)
                }
                ss++;
            }
            
            window.addEventListener('blur', (evt) => {
                ss = 0;
                second();
            });
            window.addEventListener('focus', (evt) => {
                ss = 0;
                clearTimeout(timer);
            });
        }
    },
    methods: {
        goToWindow(ref) { 
            if (ref && ref.trim() !== '#') window.location.replace(ref);
        },
        formatDate(dateString) {
            return new moment(dateString.replace('z', '')).format('DD/MM/YYYY');
        },
        closeDetails() {
            this.showDetails = false;
        },
        viewListTask(tasks, date) {
            if (tasks.length > 0) {
                this.showListTask = true;
                this.listTaskForDay = tasks;
                this.dayListTask = date;
            }
        },
        setDetails(task) {
            this.showListTask = false;
            this.showDetails = true;
            this.detailsTask = task;
        },
        filterTasks(actividades) {
            const totalLetters = this.widthWindow > 1500 ?
                80 :
                this.widthWindow > 1300 ?
                    30 :
                    this.widthWindow > 742 ?
                        20 : this.widthWindow > 644 ?
                            15 :
                            this.widthWindow > 530 ?
                                10 :
                                4;
            if (actividades.length > 3) {
                const tasks = [];
                for (let index = 0; index < 3; index++) {
                    tasks.push(actividades[index].descripcion_task.slice(0, totalLetters));
                }
                return task;
            }
            return actividades.map((task) => task.descripcion_task.slice(0, totalLetters));
        },
        showTaskNext() {
            if (!this.showedTaskNext) {
                this.$refs.taskNext.style.left = '0px';
                this.$refs.backgroundTaskNext.style.opacity = '1.0';
                this.$refs.backgroundTaskNext.style.left = '245px';
            } else {
                this.$refs.taskNext.style.left = '-250px';
                this.$refs.backgroundTaskNext.style.opacity = '0.0';
                this.$refs.backgroundTaskNext.style.left = '-100%';
            }
            this.showedTaskNext = !this.showedTaskNext;
        },
        closeTaskNext() {
            this.$refs.taskNext.style.left = '-250px';
            this.$refs.backgroundTaskNext.style.opacity = '0.0';
            this.$refs.backgroundTaskNext.style.left = '-100%';
            this.showedTaskNext = false;
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
                    const now = new moment(fecha.replace('z', ''));
                    return now >= startOfMonth && now <= endOfMonth;
                })
            });
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
                    return !!dateFinded;
                })
                semana.push({
                    dia: diaActual.format('DD'),
                    dias,
                    date: diaActual.format('DD/MM/YYYY'),
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
        colorDia(dias, diaEnd, date) {
            const classToday = this.dateNow.format('DD/MM/YYYY') === date ? 'dateToday text-white' : '';
            return (dias < 0 || dias >= diaEnd) ? `text-black-50 ${classToday}` : `text-dark fw-bold ${classToday}`;
        },
        bgDia(dias, diaEnd, date) {
            const backgroundToday = this.dateNow.format('DD/MM/YYYY') === date ? 'backgroundToday' : '';
            return (dias < 0 || dias >= diaEnd) ? 'bg-light bg-opacity-75' : backgroundToday;
        },
        showAlert(message, title = 'Advertencia', type = 'warning') {
            this.alert.title = title;
            this.alert.message = message;
            this.alert.type = type;

            this.$refs.btnAlert.click()
        },
        closeSession() {
            this.login = false;
            sessionStorage.setItem('calendario_p_login', false);
            window.location.replace('../index.html');
        },
        async loadTask() {
            try {
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/actividades/activas';

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
                    this.listTask = response.data;
                    this.changeMonth();
                } else {
                    this.showAlert(response.data.message, 'Fallo al cargar actividades', 'warning');
                }
            } catch (error) {
                this.loading = false;
                if (error.response !== undefined) {
                    this.showAlert(error.response.data.message, 'Error inesperado', 'danger');
                    if (error.response.data.message === 'No hay actividades registradas') {
                        error.response.data.data = [];
                        localStorage.setItem(
                            'calendario_list_task',
                            JSON.stringify(error.response.data)
                        )
                        this.listTask = error.response.data;
                        this.changeMonth();
                    }
                }
                else
                    this.showAlert('Fallo cargar actividades intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },

        // Actualizar perfil
        async loadPerfil() {
            try {
                this.showOptionsTasks = false;
                const user = this.dataUser.data[0].correo_user;
                const url =
                'https://us-central1-calendarioescolaritssat.cloudfunctions.net/api/v1/usuarios/' + user;

                this.loading = true;

                const response = await axios({
                    method: 'get',
                    url,
                })

                this.loading = false;

                if (response.data.success) {
                    localStorage.setItem('calendario_data_user', JSON.stringify(response.data));
                    this.dataUser = response.data;
                    if (!response.data.data[0].activo_user) this.closeSession();
                } else {
                    this.showAlert(response.data.message, 'Fallo al recargar perfil', 'warning')
                }
            } catch (error) {
                this.loading = false;
                if (error.response !== undefined)
                    this.showAlert(error.response.data.message, 'Error inesperado', 'warning');
                else
                    this.showAlert('Fallo al recargar perfil intentelo mas tarde', 'Error inesperado', 'danger');
            }
        },
    },
})
