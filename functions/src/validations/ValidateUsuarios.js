const {
    schemaCreateUser,
    schemaContentLetters,
    schemaEmail,
    schemaContentNumbers,
    schemaDate,
    schemaLogin,
    schemaUpdateUsuario,
    schemaUpdateEmail,
    schemaUpdatePassword,
    schemaUpdateActivo,
    schemaNumberPhone,
} = require("../schemas");
const { createContentAssert, createContentError } = require("../utils");

const validateUsuarios = (() => {
    
    const validateCreateUsuario = (bodyUsuarios) => {
        let resultValidate = schemaCreateUser.validate(bodyUsuarios);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        resultValidate = schemaEmail.validate(bodyUsuarios.correo_user);
        if (resultValidate.error) {
            return createContentError("El formato del correo no es valido", (resultValidate.error));
        }

        if (bodyUsuarios.password_user.length < 7) {
            return createContentError("La contraseña debe tener como minimo 7 caracteres", {})
        }

        resultValidate = schemaContentLetters.validate(bodyUsuarios.password_user);
        if (resultValidate.error) {
            return createContentError("La contraseña debe contener letras", (resultValidate.error));
        }

        resultValidate = schemaContentNumbers.validate(bodyUsuarios.password_user);
        if (resultValidate.error) {
            return createContentError("La contraseña debe contener numeros", (resultValidate.error));
        }

        resultValidate = schemaDate.validate(bodyUsuarios.fecha_alta_user);
        if (resultValidate.error) {
            return createContentError("La fecha de alta no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        resultValidate = schemaDate.validate(bodyUsuarios.fecha_modificacion_user);
        if (resultValidate.error) {
            return createContentError("La fecha de actualizacion no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        resultValidate = schemaNumberPhone.validate(bodyUsuarios.telefono_user);
        if (resultValidate.error) {
            return createContentError("El telefono no tiene el formato correcto 0000000000", (resultValidate.error));
        }

        if (
            bodyUsuarios.tipo_user != "administrador" &&
            bodyUsuarios.tipo_user != "ejecutivo" &&
            bodyUsuarios.tipo_user != "invitado"
        ) {
            return createContentError("El tipo de usuario que se recibio no es valido");
        }

        return createContentAssert("Datos validados");
    }

    const validateLogin = (bodyLogin) => {
        let resultValidate = schemaLogin.validate(bodyLogin);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }
        
        return createContentAssert("Datos validados");
    }

    const validateUpdateUsuario = (bodyUsuarios) => {
        let resultValidate = schemaUpdateUsuario.validate(bodyUsuarios);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }
        
        resultValidate = schemaDate.validate(bodyUsuarios.fecha_modificacion_user);
        if (resultValidate.error) {
            return createContentError("La fecha de actualizacion no tiene el formato correcto 0000-00-00T00:00:00.000z", (resultValidate.error));
        }

        if (
            bodyUsuarios.tipo_user != "administrador" &&
            bodyUsuarios.tipo_user != "ejecutivo" &&
            bodyUsuarios.tipo_user != "invitado"
        ) {
            return createContentError("El tipo de usuario que mando no es valido");
        }

        return createContentAssert("Datos validados");
    }

    const validateUpdateUsuarioGeneral = (bodyUsuariosGeneral) => {
        let resultValidate = schemaUpdateUsuario.validate(bodyUsuariosGeneral);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    const validateUpdateEmail = (bodyEmail) => {
        let resultValidate = schemaUpdateEmail.validate(bodyEmail);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    const validateUpdatePassword = (bodyPassword) => {
        let resultValidate = schemaUpdatePassword.validate(bodyPassword);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        if (bodyPassword.new_password_user.length < 7) {
            return createContentError("La contraseña nueva debe tener como minimo 7 caracteres", {})
        }

        resultValidate = schemaContentLetters.validate(bodyPassword.new_password_user);
        if (resultValidate.error) {
            return createContentError("La contraseña nueva debe contener letras", (resultValidate.error));
        }

        resultValidate = schemaContentNumbers.validate(bodyPassword.new_password_user);
        if (resultValidate.error) {
            return createContentError("La contraseña nueva debe contener numeros", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    const validateUpdateActivo = (bodyActivo) => {
        let resultValidate = schemaUpdateActivo.validate(bodyActivo);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera equivocada", (resultValidate.error));
        }

        return createContentAssert("Datos validados");
    }

    return {
        validateCreateUsuario,
        validateLogin,
        validateUpdateUsuario,
        validateUpdateEmail,
        validateUpdatePassword,
        validateUpdateActivo,
        validateUpdateUsuarioGeneral,
    }
})();

module.exports = validateUsuarios;
