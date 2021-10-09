const schemasActividades = require('./SchemasActividades')
const schemasUsuarios = require('./SchemasUsuarios')
const schemasAreas = require('./SchemasAreas')
const schemasMaestroActividades = require('./SchemasMaestroActividades')

const schemas = {
    ...schemasActividades,
    ...schemasUsuarios,
    ...schemasAreas,
    ...schemasMaestroActividades,
}

module.exports = schemas;
