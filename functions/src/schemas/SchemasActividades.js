const joi = require("joi");

const schemasActividades = (() => {
    const schemaCreateActividad = joi.object({
        id_master_task: joi.string().min(3).required(),
        year_task: joi.number().min(2015).required(),
        rango_fechas_task: joi.boolean().required(),
        fecha_inicial_task: joi.string().min(3).required(),
        fecha_final_task: joi.string().min(3).required(),
        descripcion_task: joi.string().min(3).required(),
        observaciones_task: joi.string().min(3).required(),
        encargado_task: joi.string().min(3).required(),
        motivo_cancelado_task: joi.string().min(3).required(),
        mes_task: joi.array().required(),
        dias_task: joi.array().required(),
        para_area_task: joi.string().min(3).required(),
        estatus_task: joi.string().min(3).required(),
        fecha_creada_task: joi.string().min(3).required(),
        creada_por_task: joi.string().min(3).required(),
        fecha_modificada_task: joi.string().min(3).required(),
        modificada_por_task: joi.string().min(3).required()
    });

    const schemaUpdateActividad = joi.object({
        id_master_task: joi.string().min(3),
        year_task: joi.number().min(2015),
        rango_fechas_task: joi.boolean(),
        fecha_inicial_task: joi.string().min(3),
        fecha_final_task: joi.string().min(3),
        descripcion_task: joi.string().min(3),
        observaciones_task: joi.string().min(3),
        encargado_task: joi.string().min(3),
        motivo_cancelado_task: joi.string().min(3),
        mes_task: joi.array(),
        dias_task: joi.array(),
        para_area_task: joi.string().min(3),
        estatus_task: joi.string().min(3),
        fecha_modificada_task: joi.string().min(3).required(),
        modificada_por_task: joi.string().min(3).required()
    });

    const schemaUpdateActividadStatus = joi.object({
        estatus_task: joi.string().min(3).required()
    });

    return {
        schemaUpdateActividadStatus,
        schemaCreateActividad,
        schemaUpdateActividad,
    }

})();

module.exports = schemasActividades;