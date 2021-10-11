const { createResponse, createContentError, createUUID } = require("../utils");
const { 
    getAllMaestroActividades,
    getMaestroActividadById,
    createMaestroActividades,
    getActividadByIdMaestro,
    updateMaestro,
    deleteMaestro,
} = require("../models");
const {
    validateCreateMaestro,
    validateUpdateMaestro,
    validateUpdateActivoMaestro,
} = require("../validations");

const servicesMaestroActividades =  (() => {

    const getAllMasterTask = async () => {
        const response = await getAllMaestroActividades();
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const getMasterTaskById = async (id_maestro) => {
        const response = await getMaestroActividadById(id_maestro);
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const verifyExistId = async (uuid) => {
        const existUser = await getMaestroActividadById(uuid);
        if (existUser.message === "Error al obtener la lista de actividades") {
            existUser.message = "Error al crear el uuid del maestro actividades"
            return createResponse(400, existUser);
        }
        
        return existUser.success;
    }
    
    const createNewMasterTask = async (bodyCreateMaster) => {
        const resultValidate = validateCreateMaestro(bodyCreateMaster);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        let uuid = createUUID();
        
        existArea = await verifyExistId(uuid);
        if (existArea.status) return existArea;
        if (existArea) {
            uuid = createUUID();
            existArea = await verifyExistId(uuid);
            if (existArea.status) return existArea;
            if (existArea) return createResponse(
                200,
                createContentError('Error al crear el uuid del Maestro actividades, intentelo de nuevo')
            );
        }

        bodyCreateMaster.UUID_master_task = uuid;

        const response = await createMaestroActividades(uuid, bodyCreateMaster);
        if(!response.success) return createResponse(400, response);

        return createResponse(201, response);
    }

    const updateDataMasterTask = async (id_maestro, bodyMaestro) => {
        const resultValidate = validateUpdateMaestro(bodyMaestro);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existArea = await getMaestroActividadById(id_maestro);
        if (existArea.message === "Error al obtener la lista de actividades")
            return createResponse(400, existArea);

        if (!existArea.success) return createResponse(404, existArea);

        const response = await updateMaestro(id_maestro, bodyMaestro);
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }
    
    const updateMasterTaskEnabled = async (id_maestro, bodyMaestro) => {
        const resultValidate = validateUpdateActivoMaestro(bodyMaestro);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existArea = await getMaestroActividadById(id_maestro);
        if (existArea.message === "Error al obtener la lista de actividades")
            return createResponse(400, existArea);

        if (!existArea.success) return createResponse(404, existArea);
        
        if (existArea.data[0].publicada_master_task === bodyActivo.publicada_master_task) 
            return createResponse(
                200,
                createContentError("El estatus de publica de maestro actividades es igual", {})
            );

        const response = await updateMaestro(id_maestro, bodyMaestro);
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }

    const deleteOldMasterTask = async (id_maestro) => {
        const existArea = await getMaestroActividadById(id_maestro);
        if (existArea.message === "Error al obtener la lista de actividades")
            return createResponse(400, existArea);
        
        if (!existArea.success) return createResponse(404, existArea);

        const existsRegisterTask = await getActividadByIdMaestro(id_maestro);
        if (existsRegisterTask.message === "Error al obtener la actividad por id de Maestro Actividades")
            return createResponse(400, existsRegisterTask);
        if (existsRegisterTask.success)
            return createResponse(
                200,
                createContentError('No se puede eliminar el area de forma permanente, debido a que tiene registros en actividades')
            );
        
        const responseDelete = await deleteMaestro(id_maestro);
        if(!responseDelete.success) return createResponse(400, responseDelete);
        
        responseDelete.message = 'El area ha sido eliminada de forma permanente';
        return createResponse(200, responseDelete);
    }

    return {
        getAllMasterTask,
        getMasterTaskById,
        createNewMasterTask,
        updateDataMasterTask,
        updateMasterTaskEnabled,
        deleteOldMasterTask,
    }
})();

module.exports = servicesMaestroActividades;
