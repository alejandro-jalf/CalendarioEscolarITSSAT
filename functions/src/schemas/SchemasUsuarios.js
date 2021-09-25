const joi = require("joi");

const schemasUsuario = (() => {
    const schemaEmail = joi.string().regex(/^\w+@{1,1}\w+\.{1,1}\w+$/).min(5);
    
    const schemaContentLetters = joi.string().regex(/[a-zA-Z]+/);

    const schemaContentNumbers = joi.string().regex(/\d+/);

    const schemaNumberPhone = joi.string().regex(/^\d{10,12}$/);
    
    // 2021-08-24T05:00:00.000z
    const schemaDate = joi.string().regex(/^\d{4,4}-\d{2,2}-\d{2,2}T\d{2,2}:\d{2,2}:\d{2,2}.000z$/);
    
    const schemaCreateUser = joi.object({
        correo_user: joi.string().min(5).required(),
        nombre_user: joi.string().min(3).required(),
        apellid_p_user: joi.string().min(3).required(),
        apellid_m_user: joi.string().min(3).required(),
        direccion_user: joi.string().min(9).required(),
        telefono_user: joi.string().min(10).max(12).required(),
        ciudad_user: joi.string().min(3).required(),
        password_user: joi.string().min(3).required(),
        tipo_user: joi.string().min(8).required(),
        area_user: joi.string().min(2).required(),
        accessTo_user: joi.object().required(),
        fecha_alta_user: joi.string().min(5).required(),
        creado_por_user: joi.string().min(5).required(),
        fecha_modificacion_user: joi.string().min(5).required(),
        modificado_por_user: joi.string().min(5).required()
    });

    const schemaLogin = joi.object({
        correo_user: joi.string().min(5).required(),
        password_user: joi.string().required()
    });

    const schemaUpdateUsuario = joi.object({
        nombre_user: joi.string().min(3),
        apellid_p_user: joi.string().min(3),
        apellid_m_user: joi.string().min(3),
        direccion_user: joi.string().min(9).max(10),
        telefono_user: joi.string().min(10).max(12),
        ciudad_user: joi.string().min(3),
        tipo_user: joi.string().min(8),
        area_user: joi.string().min(2),
        accessTo_user: joi.object(),
        fecha_modificacion_user: joi.string().min(5),
        modificado_por_user: joi.string().min(5),
        activo_user: joi.boolean()
    });

    const schemaUpdateEmail = joi.object({
        new_correo_user: joi.string().email().required(),
        password_user: joi.string().required()
    });

    const schemaUpdatePassword = joi.object({
        password_user: joi.string().required(),
        new_password_user: joi.string().min(7).required()
    });

    const schemaUpdateActivo = joi.object({
        activo_user: joi.boolean().required()
    });

    return {
        schemaDate,
        schemaLogin,
        schemaEmail,
        schemaCreateUser,
        schemaUpdateEmail,
        schemaNumberPhone,
        schemaUpdateActivo,
        schemaUpdateUsuario,
        schemaUpdatePassword,
        schemaContentNumbers,
        schemaContentLetters,
    }

})();

module.exports = schemasUsuario;