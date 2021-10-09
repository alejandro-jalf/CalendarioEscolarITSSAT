const schemasUsuarios = require('./SchemasUsuarios')
const schemasAreas = require('./SchemasAreas')
const schemasMaestroActividades = require('./SchemasMaestroActividades')

const schemas = {
    ...schemasUsuarios,
    ...schemasAreas,
    ...schemasMaestroActividades,
}

module.exports = schemas;
