const admin = require("firebase-admin");
const { createContentAssert, createContentError } = require("../utils");

const modelActividades = (() => {

    const collectionActividades = admin.firestore().collection("Actividades");
    
    const getAllActividades = async () => {
        try {
            const documentos = await collectionActividades.orderBy('UUID_task').get();

            if (documentos.empty) return createContentAssert("No hay actividades registradas");
            
            const data = [];
            documentos.forEach(doc => { data.push(doc.data()); });

            return createContentAssert("Lista de actividades", data);
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener todas las areas", error);
        }
    }
    
    const getActividadById = async (id_actividad) => {
        try {
            const actividadReferencia = collectionActividades.doc(id_actividad);
            const documento = await actividadReferencia.get();

            if (!documento.exists) return createContentError('La actividad no fue encontrada');

            return createContentAssert("Actividad localizada", documento.data());
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener la actividad por id", error);
        }
    }
    
    const createActividad = async (id_actividad, bodyActividad) => {
        try {
            await collectionActividades.doc(id_actividad).set(bodyActividad);
            return createContentAssert('Actividad creada con exito');
        } catch (error) {
            console.log(error);
            return createContentError("Error al crear la actividad", error);
        }
    }

    const updateActividad = async (id_actividad, bodyActividad) => {
        try {
            await collectionActividades.doc(id_actividad).set(bodyActividad, { merge: true });
            return createContentAssert("Actividad actualizada");
        } catch (error) {
            console.log(error);
            return createContentError("Error al actualizar el Actividad", error);
        }
    }
    
    const deleteActividad = async (id_actividad) => {
        try {
            await collectionActividades.doc(id_actividad).delete();
        
            return createContentAssert("Actividad eliminada");
        } catch (error) {
            console.log(error);
            return createContentError("Error al eliminar la actividad", error);
        }
    }

    return{
        getActividadById,
        getAllActividades,
        createActividad,
        updateActividad,
        deleteActividad,
    }
})();

module.exports = modelActividades;
