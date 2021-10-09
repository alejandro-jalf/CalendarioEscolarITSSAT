const validationUsuarios = require('./ValidateUsuarios')
const validateAreas = require('./ValidateAreas')
const validateActividades = require('./ValidateActividades')
const validateMaestroActividades = require('./ValidateMaestroActividades')

const validates = {
    ...validateActividades,
    ...validationUsuarios,
    ...validateAreas,
    ...validateMaestroActividades,
}

module.exports = validates;
