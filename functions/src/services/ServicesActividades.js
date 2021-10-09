const { createResponse, createContentError, createUUID } = require("../utils");
const {
    getAllActividades,
    getActividadById,
    createActividad,
    updateActividad,
    deleteActividad,
} = require("../models");
const {
    validateCreateActividad,
    validateUpdateActividad,
    validateUpdateActividadStatus,
} = require("../validations");

const servicesActividades =  (() => {

    const getAllTask = async () => {
        const response = await getAllActividades();
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const getTaskById = async (id_actividad) => {
        const response = await getActividadById(id_actividad);
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const verifyExistId = async (uuid) => {
        const existUser = await getActividadById(uuid);
        if (existUser.message === "Error al obtener la actividad por id") {
            existUser.message = "Error al crear el uuid de la actividad"
            return createResponse(400, existUser);
        }
        
        return existUser.success;
    }
    
    const createNewActividad = async (bodyCreateArea) => {
        const resultValidate = validateCreateActividad(bodyCreateArea);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        let uuid = createUUID();
        
        existActividad = await verifyExistId(uuid);
        if (existActividad.status) return existActividad;
        if (existActividad) {
            uuid = createUUID();
            existActividad = await verifyExistId(uuid);
            if (existActividad.status) return existActividad;
            if (existActividad) return createResponse(
                200,
                createContentError('Error al crear el uuid de la actividad, intentelo de nuevo')
            );
        }

        bodyCreateArea.UUID_task = uuid;

        const response = await createActividad(uuid, bodyCreateArea);
        if(!response.success) return createResponse(400, response);

        return createResponse(201, response);
    }

    const updateDataActividad = async (id_actividad, bodyActividad) => {
        const resultValidate = validateUpdateActividad(bodyActividad);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existActividad = await getActividadById(id_actividad);
        if (existActividad.message === "Error al obtener la actividad por id")
            return createResponse(400, existActividad);

        if (!existActividad.success) return createResponse(404, existActividad);

        const response = await updateActividad(id_actividad, bodyActividad);
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }
    
    const updateActividadStatus = async (id_actividad, bodyActividad) => {
        const resultValidate = validateUpdateActividadStatus(bodyActividad);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existActividad = await getActividadById(id_actividad);
        if (existActividad.message === "Error al obtener la actividad por id")
            return createResponse(400, existActividad);

        if (!existActividad.success) return createResponse(404, existActividad);
        
        if (existActividad.data[0].estatus_task === bodyActivo.estatus_task) 
            return createResponse(
                200,
                createContentError("El estatus de la actividad es igual", {})
            );

        const response = await updateActividad(id_actividad, bodyActividad);
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }

    const deleteOldActividad = async (id_actividad) => {
        const existActividad = await getActividadById(id_actividad);
        if (existActividad.message === "Error al obtener la actividad por id")
            return createResponse(400, existActividad);
        
        if (!existActividad.success) return createResponse(404, existActividad);
        
        const responseDelete = await deleteActividad(id_actividad);
        if(!responseDelete.success) return createResponse(400, responseDelete);
        
        responseDelete.message = 'La actividad ha sido eliminada de forma permanente';
        return createResponse(200, responseDelete);
    }

    return {
        getAllTask,
        getTaskById,
        createNewActividad,
        updateDataActividad,
        updateActividadStatus,
        deleteOldActividad,
    }
})();

module.exports = servicesActividades;
