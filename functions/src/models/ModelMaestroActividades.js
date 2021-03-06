const admin = require("firebase-admin");
const { createContentAssert, createContentError } = require("../utils");

const modelActividades = (() => {

    const collectionMaestroActividades = admin.firestore().collection("MaestroActivades");
    
    const getAllMaestroActividades = async () => {
        try {
            const documentos = await collectionMaestroActividades.orderBy('UUID_master_task').get();

            if (documentos.empty) return createContentAssert("No hay lista de actividades registradas");
            
            const data = [];
            documentos.forEach(doc => { data.push(doc.data()); });

            return createContentAssert("Listas de actividades", data);
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener todas las listas de actividades", error);
        }
    }
    
    const getMaestroActividadById = async (id_maestro_actividades) => {
        try {
            const areaReferencia = collectionMaestroActividades.doc(id_maestro_actividades);
            const documento = await areaReferencia.get();

            if (!documento.exists) return createContentError('La lista de actividades no fue encontrada');

            return createContentAssert("Lista de actividades localizada", documento.data());
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener la lista de actividades", error);
        }
    }
    
    const getMaestroActividadByIdUser = async (idUser) => {
        try {
            const documentosCreate = await collectionMaestroActividades.where('creada_por_master_task', '==', idUser).get();
            const documentosUpdate = await collectionMaestroActividades.where('modificada_por_master_task', '==', idUser).get();
            if (documentosUpdate.empty && documentosCreate.empty)
                return createContentError('Maestro Actividades por usuario no fue encontrada');

            return createContentAssert("Maestro Actividades por usuario localizada");
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener la Maestro Actividades por id de usario", error);
        }
    }
    
    const createMaestroActividades = async (id_maestro_actividades, bodyMaestroActividades) => {
        try {
            await collectionMaestroActividades.doc(id_maestro_actividades).set(bodyMaestroActividades);
            return createContentAssert(`Se a creado la lista de actividades con exito`);
        } catch (error) {
            console.log(error);
            return createContentError("Error al crear el area", error);
        }
    }

    const updateMaestro = async (id_maestro_actividades, bodyMaestroActividades) => {
        try {
            await collectionMaestroActividades.doc(id_maestro_actividades).set(bodyMaestroActividades, { merge: true });
            return createContentAssert("Lista de actividades actualizada");
        } catch (error) {
            console.log(error);
            return createContentError("Error al actualizar la lista de actividades", error);
        }
    }
    
    const deleteMaestro = async (id_maestro_actividades) => {
        try {
            await collectionMaestroActividades.doc(id_maestro_actividades).delete();
        
            return createContentAssert("Lista de actividades eliminada");
        } catch (error) {
            console.log(error);
            return createContentError("Error al eliminar la lista de actividades", error);
        }
    }

    return{
        getMaestroActividadByIdUser,
        getMaestroActividadById,
        getAllMaestroActividades,
        createMaestroActividades,
        updateMaestro,
        deleteMaestro,
    }
})();

module.exports = modelActividades;
