const joi = require("joi");

const schemasMaestroActividades = (() => {
    const schemaCreateMaestro = joi.object({
        titulo_master_task: joi.string().min(3).required(),
        publicada_master_task: joi.boolean().required(),
        fecha_creada_master_task: joi.string().min(5).required(),
        creada_por_master_task: joi.string().min(5).required(),
        fecha_modificada_master_task: joi.string().min(5).required(),
        modificada_por_master_task: joi.string().min(5).required()
    });

    const schemaUpdateMAestro = joi.object({
        titulo_master_task: joi.string().min(3),
        publicada_master_task: joi.boolean(),
        fecha_modificada_master_task: joi.string().min(5).required(),
        modificada_por_master_task: joi.string().min(5).required()
    });

    const schemaUpdateActivoMaestro = joi.object({
        publicada_master_task: joi.boolean().required()
    });

    return {
        schemaUpdateActivoMaestro,
        schemaCreateMaestro,
        schemaUpdateMAestro,
    }

})();

module.exports = schemasMaestroActividades;