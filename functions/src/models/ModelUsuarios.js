const admin = require("firebase-admin");
const { createContentAssert, createContentError } = require("../utils");

const modelUsuarios = (() => {

    const collectionUser = admin.firestore().collection("Usuarios");
    
    const getAllUsers = async () => {
        try {
            const documentos = await collectionUser.orderBy('UUID_user').get();

            if (documentos.empty) return createContentAssert("No hay usuarios registrados");

            const data = documentos.reduce((acumuladoDoc, documento) => {
                acumuladoDoc.push(documento.data())
                return acumuladoDoc;
            }, [])

            return createContentAssert("Lista de usuarios", data);
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener todos los usuarios", error);
        }
    }
    
    const getUserById = async (id_user) => {
        try {
            const userReferencia = collectionUser.doc(id_user);
            const documento = await userReferencia.get();

            if (!documento.exists) return createContentError('El usuario no esta registrado');

            return createContentAssert("Usuario localizado", documento.data());
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener usuario por id", error);
        }
    }
    
    const getUserByCorreo = async (correo_user) => {
        try {
            const documentos = await collectionUser.where('correo_user', '==', correo_user).get();

            if (documentos.empty)
                return createContentError('No se encontro al usuario con el correo: ' + correo_user);

            return createContentAssert("Usuario localizado", documentos[0].data());
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener usuario por correo", error);
        }
    }
    
    const createUser = async (id_user, bodyUsuarios) => {
        try {
            await collectionUser.doc(id_user).set(bodyUsuarios);
            return createContentAssert(`El usuario ${bodyUsuarios.correo_user} ha sido creado`);
        } catch (error) {
            console.log(error);
            return createContentError("Error al crear el usuario", error);
        }
    }

    const updateUser = async (id_user, bodyUsuarios) => {
        try {
            await collectionUser.doc(id_user).set(bodyUsuarios, { merge: true });
            return createContentAssert("Usuario actualizado");
        } catch (error) {
            console.log(error);
            return createContentError("Error al actualizar el usuario", error);
        }
    }
    
    const deleteUser = async (id_user) => {
        try {
            await collectionUser.doc(id_user).delete();
        
            return createContentAssert("Usuario eliminado");
        } catch (error) {
            console.log(error);
            return createContentError("Error al eliminar el usuario", error);
        }
    }

    return{
        getUserByCorreo,
        getUserById,
        getAllUsers,
        createUser,
        updateUser,
        deleteUser,
    }
})();

module.exports = modelUsuarios;
