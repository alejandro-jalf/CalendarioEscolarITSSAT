const { createResponse, createContentError, encriptData, sendEmail, createUUID } = require("../utils");
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserByCorreo,
    getUserById,
    getActividadByIdUser,
    getAreaByIdUser,
} = require("../models");
const {
    validateCreateUsuario,
    validateLogin,
    validateUpdateUsuario,
    validateUpdateUsuarioGeneral,
    validateUpdateEmail,
    validateUpdatePassword,
    validateUpdateActivo,
} = require("../validations");

const servicesUsuarios =  (() => {

    const getAllUsuarios = async () => {
        const response = await getAllUsers();
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const getUsuario = async (correo_user) => {
        const response = await getUserByCorreo(correo_user);
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const verifyExistId = async (uuid) => {
        const existUser = await getUserById(uuid);
        if (existUser.message === "Error al obtener usuario por correo") {
            existUser.message = "Error al crear el uuid del usuario"
            return createResponse(400, existUser);
        }
        
        if (existUser.success) return true;
        return false;
    }

    const createUsuario = async (bodyUsuarios) => {
        const resultValidate = validateCreateUsuario(bodyUsuarios);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        let existUser = await getUserByCorreo(bodyUsuarios.correo_user);
        if (existUser.message === "Error al obtener usuario por correo")
            return createResponse(400, existUser);

        if (existUser.success)
            return createResponse(200, createContentError(`El correo ${bodyUsuarios.correo_user} ya esta registrado`, {}));

        let uuid = createUUID();
        
        existUser = await verifyExistId(uuid);
        if (existUser.status) return existUser;
        if (existUser) {
            uuid = createUUID();
            existUser = await verifyExistId(uuid);
            if (existUser.status) return existUser;
            if (existUser) return createResponse(
                200,
                createContentError('Error al crear el uuid del usuario, intentelo de nuevo')
            );
        }

        bodyUsuarios.UUID_user = uuid;
        bodyUsuarios.activo_user = true;
        bodyUsuarios.recovery_code_user = 'empty';

        bodyUsuarios.password_user = encriptData(bodyUsuarios.password_user);
        const response = await createUser(uuid, bodyUsuarios);

        if(!response.success) return createResponse(400, response);

        return createResponse(201, response);
    }

    const loginUsuario = async (correo_user, bodyLogin) => {
        const resultValidate = validateLogin(bodyLogin);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existUser = await getUserByCorreo(correo_user);
        if (existUser.message === "Error al obtener usuario por correo")
            return createResponse(400, existUser);
        
        if (!existUser.success) return createResponse(200, existUser);

        if (existUser.data[0].recovery_code_user === 'empty') {
            if (existUser.data[0].password_user !== encriptData(bodyLogin.password_user))
                return createResponse(
                    401,
                    createContentError("La contraseña es incorrecta", {})
                );
        } else {
            if (
                existUser.data[0].password_user !== encriptData(bodyLogin.password_user) &&
                existUser.data[0].recovery_code_user !== bodyLogin.password_user
            ) return createResponse(
                    401,
                    createContentError("Codigo de seguridad y contraseña actual incorrecta", {})
                );
        }

        if (!existUser.data[0].activo_user)
            return createResponse(
                401,
                createContentError("Tu cuenta esta supendida, comunicate con el administrador", {})
            );

        delete existUser.data[0].modificado_por_user
        delete existUser.data[0].creado_por_user
        delete existUser.data[0].fecha_modificacion_user
        delete existUser.data[0].fecha_alta_user
        delete existUser.data[0].password_user

        existUser.message = "Bienvenido";
        return createResponse(200, existUser);
    }

    const updateUsuario = async (correo_user, bodyUsuarios) => {
        const resultValidate = validateUpdateUsuario(bodyUsuarios);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existUser = await getUserByCorreo(correo_user);
        if (existUser.message === "Error al obtener usuario por correo")
            return createResponse(400, existUser);

        if (!existUser.success) return createResponse(200, existUser);

        const id_user = existUser.data[0].UUID_user
        
        const response = await updateUser(id_user, bodyUsuarios);
        
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }

    const updateUsuarioGeneral = async (correo_user, bodyUsuarios) => {
        const resultValidate = validateUpdateUsuarioGeneral(bodyUsuarios);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existUser = await getUserByCorreo(correo_user);
        if (existUser.message === "Error al obtener usuario por correo")
            return createResponse(400, existUser);

        if (!existUser.success) return createResponse(200, existUser);

        const id_user = existUser.data[0].UUID_user
        
        const response = await updateUser(id_user, bodyUsuarios);
        
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }

    const updateCorreo = async (correo_user, bodyCorreo) => {
        const resultValidate = validateUpdateEmail(bodyCorreo);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        if (correo_user === bodyCorreo.new_correo_user) 
            return createResponse(
                200,
                createContentError("El nuevo correo es igual al correo actual", {})
            );

        const existUser = await getUserByCorreo(correo_user);
        if (existUser.message === "Error al obtener usuario por correo")
            return createResponse(400, existUser);
        
        if (!existUser.success) return createResponse(200, existUser);

        if (existUser.data[0].password_user !== encriptData(bodyCorreo.password_user))
            return createResponse(
                401,
                createContentError("La contraseña actual no es correcta", {})
            );

        const id_user = existUser.data[0].UUID_user
        
        bodyCorreo.correo_user = bodyCorreo.new_correo_user
        delete bodyCorreo.password_user
        delete bodyCorreo.new_correo_user

        const response = await updateUser(id_user, bodyCorreo);
        
        if(!response.success) return createResponse(400, response);
        response.message = "El Correo ha sido actualizado"
        
        return createResponse(200, response);
    }

    const updateContra = async (correo_user, bodyPassword) => {
        const resultValidate = validateUpdatePassword(bodyPassword);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existUser = await getUserByCorreo(correo_user);
        if (existUser.message === "Error al obtener usuario por correo") 
            return createResponse(400, existUser);
        
        if (!existUser.success) return createResponse(200, existUser);

        if (existUser.data[0].password_user !== encriptData(bodyPassword.password_user))
            return createResponse(
                200,
                createContentError("Contraseña actual incorrecta", {})
            );

        const newPassword = encriptData(bodyPassword.new_password_user);
        if (existUser.data[0].password_user === newPassword)
            return createResponse(
                200,
                createContentError("La nueva contraseña y la contraeña actual son iguales", {})
            );

        delete bodyPassword.new_password_user;
        bodyPassword.password_user = newPassword;

        const response = await updateUser(existUser.data[0].UUID_user, bodyPassword);
        
        if(!response.success) return createResponse(400, response);
        
        response.message = "La contraseña ha sido actualizada";
        return createResponse(200, response);
    }

    const recuperaPassword = async (correo_user) => {
        const existUser = await getUserByCorreo(correo_user);
        if (existUser.message === "Error al obtener usuario por correo")
            return createResponse(400, existUser);
        
        if (!existUser.success)
            return createResponse(200, existUser);

        const caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ012346789";
        let codigo = "";
        for (i=0; i<13; i++) codigo +=caracteres.charAt(Math.floor(Math.random()*caracteres.length));

        let response = await updateUser(existUser.data[0].UUID_user, { recovery_code_user: codigo })
        if(!response.success) {
            response.message = 'No su puedo crear el codigo de recuperacion, intentelo mas tarde'
            return createResponse(400, response);
        }

        response = await sendEmail(correo_user, codigo);
        if (!response.success) return createResponse(400, response);

        return createResponse(200, response);
    }

    const updateActivo = async (correo_user, bodyActivo) => {
        const resultValidate = validateUpdateActivo(bodyActivo);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existUser = await getUserByCorreo(correo_user);
        if (existUser.message === "Error al obtener usuario por correo")
            return createResponse(400, existUser);
        
        if (!existUser.success) return createResponse(200, existUser);

        if (existUser.data[0].activo_user === bodyActivo.activo_user) 
            return createResponse(
                200,
                createContentError("El estatus de activo_user es igual", {})
            );

        const response = await updateUser(existUser.data[0].UUID_user, bodyActivo);
        
        if(!response.success) return createResponse(400, response);
        
        response.message = "Se a cambiado el estatus del usuario a: " + bodyActivo.activo_user;
        return createResponse(200, response);
    }

    const deleteUsuario = async (correo_user) => {
        const existUser = await getUserByCorreo(correo_user);
        if (existUser.message === "Error al obtener usuario por correo")
            return createResponse(400, existUser);
        
        if (!existUser.success) return createResponse(404, existUser);

        const existsRegisterTask = await getActividadByIdUser(existUser.data[0].UUID_user);
        if (existsRegisterTask.message === "Error al obtener la actividad por id de usario")
            return createResponse(400, existsRegisterTask);
        if (existsRegisterTask.success)
            return createResponse(
                200,
                createContentError('No se puede eliminar al usuario de forma permanente, debido a que tiene registros en actividades')
            );
        
        const existsRegisterArea = await getAreaByIdUser(existUser.data[0].UUID_user);
        if (existsRegisterArea.message === "Error al obtener la Area por id de usario")
            return createResponse(400, existsRegisterArea);
        if (existsRegisterArea.success)
            return createResponse(
                200,
                createContentError('No se puede eliminar al usuario de forma permanente, debido a que tiene registros en areas')
            );
        
        const existsRegisterMaster = await getAreaByIdUser(existUser.data[0].UUID_user);
        if (existsRegisterMaster.message === "Error al obtener la Maestro Actividades por id de usario")
            return createResponse(400, existsRegisterMaster);
        if (existsRegisterMaster.success) 
            return createResponse(
                200,
                createContentError('No se puede eliminar al usuario de forma permanente, debido a que tiene registros en maestro actividades')
            );
        
        const responseDelete = await deleteUser(existUser.data[0].UUID_user);
        if(!responseDelete.success) return createResponse(400, responseDelete);
        
        responseDelete.message = `La cuenta de usuario ${correo_user} ha sido eliminada`;
        return createResponse(200, responseDelete);
    }

    return {
        getAllUsuarios,
        getUsuario,
        createUsuario,
        loginUsuario,
        updateUsuario,
        updateCorreo,
        updateContra,
        updateActivo,
        deleteUsuario,
        recuperaPassword,
        updateUsuarioGeneral,
    }
})();

module.exports = servicesUsuarios;
