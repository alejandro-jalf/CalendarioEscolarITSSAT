const {
    schemaDate,
    schemaCreateMaestro,
    schemaUpdateMAestro,
    schemaUpdateActivoMaestro,
} = require("../schemas");
const { createContentAssert, createContentError } = require("../utils");

const validateMaestroActividades = (() => {
    
    const validateCreateMaestro = (bodyCreateMaestro) => {
        let resultValidate = schemaCreateMaestro.validate(bodyCreateMaestro);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        resultValidate = schemaDate.validate(bodyCreateMaestro.fecha_creada_master_task);
        if (resultValidate.error) {
            return createContentError("La fecha de alta no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        resultValidate = schemaDate.validate(bodyCreateMaestro.fecha_modificada_master_task);
        if (resultValidate.error) {
            return createContentError("La fecha de actualizacion no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    const validateUpdateMaestro = (bodyUpdateMaestro) => {
        let resultValidate = schemaUpdateMAestro.validate(bodyUpdateMaestro);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        resultValidate = schemaDate.validate(bodyUpdateMaestro.fecha_modificada_master_task);
        if (resultValidate.error) {
            return createContentError("La fecha de actualizacion no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    const validateUpdateActivoMaestro = (bodyActivo) => {
        let resultValidate = schemaUpdateActivoMaestro.validate(bodyActivo);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    return {
        validateCreateMaestro,
        validateUpdateMaestro,
        validateUpdateActivoMaestro,
    }
})();

module.exports = validateMaestroActividades;
