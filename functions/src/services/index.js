const servicesUsuarios = require('./ServicesUsuarios')
const servicesMaestroActividades = require('./ServicesMaestroActividades')
const servicesAreas = require('./ServicesAreas')
const servicesActividades = require('./ServicesActividades')

const services = {
    ...servicesAreas,
    ...servicesUsuarios,
    ...servicesActividades,
    ...servicesMaestroActividades,
}

module.exports = services;
