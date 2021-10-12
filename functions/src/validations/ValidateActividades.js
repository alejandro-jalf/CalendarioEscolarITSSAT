const {
    schemaDate,
    schemaCreateActividad,
    schemaUpdateActividad,
    schemaUpdateActividadStatus,
} = require("../schemas");
const { createContentAssert, createContentError } = require("../utils");

const validateActividades = (() => {
    
    const validateCreateActividad = (bodyCreateActividad) => {
        let resultValidate = schemaCreateActividad.validate(bodyCreateActividad);
        if (resultValidate.error)
            return createContentError("Algun dato fue enviado de manera equivocada", resultValidate.error);

        resultValidate = schemaDate.validate(bodyCreateActividad.fecha_creada_task);
        if (resultValidate.error) return createContentError(
            "La fecha de alta no tiene el formato correcto 0000-00-00T00:00:00.000z",
            resultValidate.error
        );

        resultValidate = schemaDate.validate(bodyCreateActividad.fecha_modificada_task);
        if (resultValidate.error) return createContentError(
            "La fecha de actualizacion no tiene el formato correcto 0000-00-00T00:00:00.000z",
            resultValidate.error
        );

        if (
            bodyCreateActividad.estatus_task.trim().toUpperCase() !== 'PENDIENTE' &&
            bodyCreateActividad.estatus_task.trim().toUpperCase() !== 'REALIZADA' &&
            bodyCreateActividad.estatus_task.trim().toUpperCase() !== 'CANCELADA'
        ) return createContentError('El estatus de la actividad no es valido');

        return createContentAssert("Datos validados");
    }

    const validateUpdateActividad = (bodyUpdateActividad) => {
        let resultValidate = schemaUpdateActividad.validate(bodyUpdateActividad);
        if (resultValidate.error)
            return createContentError("Algun dato fue enviado de manera equivocada", resultValidate.error);

        resultValidate = schemaDate.validate(bodyUpdateActividad.fecha_modificada_task);
        if (resultValidate.error) return createContentError(
            "La fecha de actualizacion no tiene el formato correcto 0000-00-00T00:00:00.000z",
            resultValidate.error
        );

        if (
            bodyUpdateActividad.estatus_task.trim().toUpperCase() !== 'PENDIENTE' &&
            bodyUpdateActividad.estatus_task.trim().toUpperCase() !== 'REALIZADA' &&
            bodyUpdateActividad.estatus_task.trim().toUpperCase() !== 'CANCELADA'
        ) return createContentError('El estatus de la actividad no es valido');

        return createContentAssert("Datos validados");
    }

    const validateUpdateActividadStatus = (bodyActivo) => {
        let resultValidate = schemaUpdateActividadStatus.validate(bodyActivo);
        if (resultValidate.error)
            return createContentError("Algun dato fue enviado de manera equivocada", resultValidate.error);

        return createContentAssert("Datos validados");
    }

    return {
        validateCreateActividad,
        validateUpdateActividad,
        validateUpdateActividadStatus,
    }
})();

module.exports = validateActividades;
