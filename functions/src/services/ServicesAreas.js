const { createResponse, createContentError, createUUID } = require("../utils");
const { 
    getAllAreas,
    getAreaById,
    createArea,
    updateArea,
    getActividadByIdArea,
    deleteArea,
} = require("../models");
const {
    validateCreateArea,
    validateUpdateArea,
    validateUpdateActivaArea,
} = require("../validations");

const servicesUsuarios =  (() => {

    const getAreas = async () => {
        const response = await getAllAreas();
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const getArea = async (id_area) => {
        const response = await getAreaById(id_area);
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const verifyExistId = async (uuid) => {
        const existUser = await getAreaById(uuid);
        if (existUser.message === "Error al obtener el area por id") {
            existUser.message = "Error al crear el uuid del area"
            return createResponse(400, existUser);
        }
        
        if (existUser.success) return true;
        return false;
    }
    
    const createNewArea = async (bodyCreateArea) => {
        const resultValidate = validateCreateArea(bodyCreateArea);
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
                createContentError('Error al crear el uuid del Area, intentelo de nuevo')
            );
        }

        bodyCreateArea.UUID_area = uuid;
        bodyCreateArea.activa_area = true;

        const response = await createArea(uuid, bodyCreateArea);
        if(!response.success) return createResponse(400, response);

        return createResponse(201, response);
    }

    const updateDataArea = async (id_area, bodyArea) => {
        const resultValidate = validateUpdateArea(bodyArea);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existArea = await getAreaById(id_area);
        if (existArea.message === "Error al obtener el area por id")
            return createResponse(400, existArea);

        if (!existArea.success) return createResponse(404, existArea);

        const response = await updateArea(id_area, bodyArea);
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }
    
    const updateAreaActiva = async (id_area, bodyArea) => {
        const resultValidate = validateUpdateActivaArea(bodyArea);
        if (!resultValidate.success) return createResponse(400, resultValidate);

        const existArea = await getAreaById(id_area);
        if (existArea.message === "Error al obtener el area por id")
            return createResponse(400, existArea);

        if (!existArea.success) return createResponse(404, existArea);
        
        if (existArea.data[0].activa_area === bodyActivo.activa_area) 
            return createResponse(
                200,
                createContentError("El estatus de activa_area es igual", {})
            );

        const response = await updateArea(id_area, bodyArea);
        if(!response.success) return createResponse(400, response);
        
        return createResponse(200, response);
    }

    const deleteOldArea = async (id_area) => {
        const existArea = await getAreaById(id_area);
        if (existArea.message === "Error al obtener el area por id")
            return createResponse(400, existArea);
        
        if (!existArea.success) return createResponse(404, existArea);

        const existsRegisterTask = await getActividadByIdArea(id_area);
        if (existsRegisterTask.message === "Error al obtener la actividad por id de area")
            return createResponse(400, existsRegisterTask);
        if (existsRegisterTask.success)
            return createResponse(
                200,
                createContentError('No se puede eliminar el area de forma permanente, debido a que tiene registros en actividades')
            );
        
        const responseDelete = await deleteArea(id_area);
        if(!responseDelete.success) return createResponse(400, responseDelete);
        
        responseDelete.message = 'El area ha sido eliminada de forma permanente';
        return createResponse(200, responseDelete);
    }

    return {
        getAreas,
        getArea,
        createNewArea,
        updateDataArea,
        updateAreaActiva,
        deleteOldArea,
    }
})();

module.exports = servicesUsuarios;
