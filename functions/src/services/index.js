const servicesUsuarios = require('./ServicesUsuarios')
const servicesMaestroActividades = require('./ServicesMaestroActividades')
const servicesAreas = require('./ServicesAreas')

const services = {
    ...servicesAreas,
    ...servicesUsuarios,
    ...servicesMaestroActividades,
}

module.exports = services;
