const { createResponse, createContentError, createUUID } = require("../utils");
const {
    getAllMaestroActividades,
    getAllUsers,
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
        const arrayFunctions = [getAllMaestroActividades, getAllUsers]
        const arrayResponse = arrayFunctions.map(async (functionExe) => await functionExe());
        const response = await Promise.all(arrayResponse);

        if (!response[0].success || !response[1].success)
            return createResponse(400, createContentError('Error al obtener las listas de actividades'));

        const dataRefactor = response[0].data.map((master) => {
            let userFinded = response[1].data.find((user) => master.creada_por_master_task === user.UUID_user)
            if (userFinded) master.creada_por_master_task = {
                uuid: userFinded.UUID_user,
                correo: userFinded.correo_user
            }
            userFinded = response[1].data.find((user) => master.modificada_por_master_task === user.UUID_user)
            if (userFinded) master.modificada_por_master_task = {
                uuid: userFinded.UUID_user,
                correo: userFinded.correo_user
            }
            return master
        })
        
        response[0].data = dataRefactor.sort((a, b) => a.UUID_master_task > b.UUID_master_task ? -1 : 1)
        return createResponse(200, response[0]);
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
        
        let existMaster = await verifyExistId(uuid);
        if (existMaster.status) return existMaster;
        if (existMaster) {
            uuid = createUUID();
            existMaster = await verifyExistId(uuid);
            if (existMaster.status) return existMaster;
            if (existMaster) return createResponse(
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

        const existMaster = await getMaestroActividadById(id_maestro);
        if (existMaster.message === "Error al obtener la lista de actividades")
            return createResponse(400, existMaster);

        if (!existMaster.success) return createResponse(404, existMaster);

        const response = await updateMaestro(id_maestro, bodyMaestro);
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }
    
    const updateMasterTaskEnabled = async (id_maestro, bodyMaestro) => {
        const resultValidate = validateUpdateActivoMaestro(bodyMaestro);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existMaster = await getMaestroActividadById(id_maestro);
        if (existMaster.message === "Error al obtener la lista de actividades")
            return createResponse(400, existMaster);

        if (!existMaster.success) return createResponse(404, existMaster);
        
        if (existMaster.data.publicada_master_task === bodyMaestro.publicada_master_task) 
            return createResponse(
                200,
                createContentError("El estatus de publica de maestro actividades es igual", {})
            );

        const response = await updateMaestro(id_maestro, bodyMaestro);
        if(!response.success) return createResponse(400, response);

        return createResponse(200, response);
    }

    const deleteOldMasterTask = async (id_maestro) => {
        const existMaster = await getMaestroActividadById(id_maestro);
        if (existMaster.message === "Error al obtener la lista de actividades")
            return createResponse(400, existMaster);
        
        if (!existMaster.success) return createResponse(404, existMaster);

        const existsRegisterTask = await getActividadByIdMaestro(id_maestro);
        if (existsRegisterTask.message === "Error al obtener la actividad por id de Maestro Actividades")
            return createResponse(400, existsRegisterTask);
        if (existsRegisterTask.success)
            return createResponse(
                200,
                createContentError('No se puede eliminar la lista de actividades de forma permanente, debido a que tiene registros en actividades')
            );
        
        const responseDelete = await deleteMaestro(id_maestro);
        if(!responseDelete.success) return createResponse(400, responseDelete);
        
        responseDelete.message = 'La lista de actividades ha sido eliminada de forma permanente';
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
