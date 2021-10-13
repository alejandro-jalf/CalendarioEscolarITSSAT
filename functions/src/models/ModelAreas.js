const admin = require("firebase-admin");
const { createContentAssert, createContentError } = require("../utils");

const modelActividades = (() => {

    const collectionArea = admin.firestore().collection("Areas");
    
    const getAllAreas = async () => {
        try {
            const documentos = await collectionArea.orderBy('UUID_area').get();

            if (documentos.empty) return createContentAssert("No hay areas registradas");
            
            const data = [];
            documentos.forEach(doc => { data.push(doc.data()); });

            return createContentAssert("Lista de areas", data);
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener todas las areas", error);
        }
    }
    
    const getAreaById = async (id_area) => {
        try {
            const areaReferencia = collectionArea.doc(id_area);
            const documento = await areaReferencia.get();

            if (!documento.exists) return createContentError('El area no fue encontrada');

            return createContentAssert("Area localizada", documento.data());
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener el area por id", error);
        }
    }
    
    const getAreaByIdUser = async (idUser) => {
        try {
            const documentosCreate = await collectionArea.where('creada_por_area', '==', idUser).get();
            const documentosUpdate = await collectionArea.where('modificada_por_area', '==', idUser).get();
            if (documentosUpdate.empty && documentosCreate.empty)
                return createContentError('Area por usuario no fue encontrada');

            return createContentAssert("Area por usuario localizada");
        } catch (error) {
            console.log(error);
            return createContentError("Error al obtener la Area por id de usario", error);
        }
    }
    
    const createArea = async (id_area, bodyAreas) => {
        try {
            await collectionArea.doc(id_area).set(bodyAreas);
            return createContentAssert(`El area ${bodyAreas.nombre_area} ha sido creada`);
        } catch (error) {
            console.log(error);
            return createContentError("Error al crear el area", error);
        }
    }

    const updateArea = async (id_area, bodyAreas) => {
        try {
            await collectionArea.doc(id_area).set(bodyAreas, { merge: true });
            return createContentAssert("Area actualizada");
        } catch (error) {
            console.log(error);
            return createContentError("Error al actualizar el area", error);
        }
    }
    
    const deleteArea = async (id_area) => {
        try {
            await collectionArea.doc(id_area).delete();
        
            return createContentAssert("Area eliminada");
        } catch (error) {
            console.log(error);
            return createContentError("Error al eliminar el area", error);
        }
    }

    return{
        getAreaByIdUser,
        getAreaById,
        getAllAreas,
        createArea,
        updateArea,
        deleteArea,
    }
})();

module.exports = modelActividades;
