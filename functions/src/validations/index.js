const validationUsuarios = require('./ValidateUsuarios')
const validateAreas = require('./ValidateAreas')

const validates = {
    ...validationUsuarios,
    ...validateAreas,
}

module.exports = validates;
