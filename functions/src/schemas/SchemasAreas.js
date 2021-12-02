const joi = require("joi");

const schemasAreas = (() => {
    const schemaCreateArea = joi.object({
        maestro_area: joi.string().min(3).required(),
        nombre_area: joi.string().min(3).required(),
        fecha_creada_area: joi.string().min(5).required(),
        creada_por_area: joi.string().min(5).required(),
        fecha_modificada_area: joi.string().min(5).required(),
        modificada_por_area: joi.string().min(5).required(),
    });

    const schemaUpdateArea = joi.object({
        maestro_area: joi.string().min(3),
        nombre_area: joi.string().min(3),
        fecha_modificada_area: joi.string().min(5).required(),
        modificada_por_area: joi.string().min(5).required(),
        activa_area: joi.boolean(),
    });

    const schemaUpdateActivaArea = joi.object({
        activa_area: joi.boolean().required()
    });

    return {
        schemaUpdateActivaArea,
        schemaCreateArea,
        schemaUpdateArea,
    }

})();

module.exports = schemasAreas;