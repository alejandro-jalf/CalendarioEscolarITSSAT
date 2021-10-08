const schemasUsuarios = require('./SchemasUsuarios')
const schemasAreas = require('./SchemasAreas')

const schemas = {
    ...schemasUsuarios,
    ...schemasAreas,
}

module.exports = schemas;
