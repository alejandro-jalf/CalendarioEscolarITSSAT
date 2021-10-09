const validationUsuarios = require('./ValidateUsuarios')
const validateAreas = require('./ValidateAreas')
const validateMaestroActividades = require('./ValidateMaestroActividades')

const validates = {
    ...validationUsuarios,
    ...validateAreas,
    ...validateMaestroActividades,
}

module.exports = validates;
