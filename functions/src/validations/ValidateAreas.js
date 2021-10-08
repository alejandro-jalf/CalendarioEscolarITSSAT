const {
    schemaDate,
    schemaCreateArea,
    schemaUpdateArea,
    schemaUpdateActivaArea,
} = require("../schemas");
const { createContentAssert, createContentError } = require("../utils");

const validateAreas = (() => {
    
    const validateCreateArea = (bodyCreateArea) => {
        let resultValidate = schemaCreateArea.validate(bodyCreateArea);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        resultValidate = schemaDate.validate(bodyCreateArea.fecha_creada_area);
        if (resultValidate.error) {
            return createContentError("La fecha de alta no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        resultValidate = schemaDate.validate(bodyCreateArea.fecha_modificada_area);
        if (resultValidate.error) {
            return createContentError("La fecha de actualizacion no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    const validateUpdateArea = (bodyUpdateArea) => {
        let resultValidate = schemaUpdateArea.validate(bodyUpdateArea);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        resultValidate = schemaDate.validate(bodyUpdateArea.fecha_modificada_area);
        if (resultValidate.error) {
            return createContentError("La fecha de actualizacion no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }
    const validateUpdateActivaArea = (bodyActivo) => {
        let resultValidate = schemaUpdateActivaArea.validate(bodyActivo);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    return {
        validateCreateArea,
        validateUpdateArea,
        validateUpdateActivaArea,
    }
})();

module.exports = validateAreas;
