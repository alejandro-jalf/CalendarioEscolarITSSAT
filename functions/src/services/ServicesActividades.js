const { createResponse, createContentError, createUUID } = require("../utils");
const {
    getAllMaestroActividades,
    getAllAreas,
    getAllUsers,
    getAllActividades,
    getActividadById,
    getActividadByIdMaestro,
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

    const getAllTaskWithoutInfo = async () => {
        const response = await getAllActividades();
        if (!response.success) return createResponse(400, response);
        return createResponse(200, response);
    }

    const getAllTask = async () => {
        const arrayFunctions = [getAllActividades, getAllMaestroActividades, getAllAreas, getAllUsers]
        const arrayResponse = arrayFunctions.map(async (functionExe) => await functionExe());
        const response = await Promise.all(arrayResponse);

        if (
            !response[0].success ||
            !response[1].success ||
            !response[2].success ||
            !response[3].success
        )
            return createResponse(400, createContentError('Error al obtener las actividades'));
        
        if (response[0].message === 'No hay actividades registradas')
            return createResponse(400, response[0]);

        const dataRefactor = response[0].data.map((actividad) => {
            if (response[1].data) {
                let masterFinded = response[1].data.find((master) => actividad.id_master_task === master.UUID_master_task)
                if (masterFinded) actividad.id_master_task = {
                    uuid: masterFinded.UUID_master_task,
                    titulo: masterFinded.titulo_master_task
                }
            }

            if (response[2].data) {
                let areaFinded = response[2].data.find((areas) => actividad.para_area_task === areas.UUID_area)
                if (areaFinded) actividad.para_area_task = {
                    uuid: areaFinded.UUID_area,
                    nombre: areaFinded.nombre_area
                }
            }

            if (response[3].data) {
                let userFinded = response[3].data.find((user) => actividad.creada_por_task === user.UUID_user)
                if (userFinded) actividad.creada_por_task = {
                    uuid: userFinded.UUID_user,
                    correo: userFinded.correo_user
                }
                userFinded = response[3].data.find((user) => actividad.modificada_por_task === user.UUID_user)
                if (userFinded) actividad.modificada_por_task = {
                    uuid: userFinded.UUID_user,
                    correo: userFinded.correo_user
                }
            }
            return actividad
        })
        
        response[0].data = dataRefactor.sort((a, b) => a.UUID_area > b.UUID_area ? -1 : 1)
        return createResponse(200, response[0]);
    }

    const getAllTaskEnabled = async () => {
        const arrayFunctions = [getAllActividades, getAllMaestroActividades, getAllAreas, getAllUsers]
        const arrayResponse = arrayFunctions.map(async (functionExe) => await functionExe());
        const response = await Promise.all(arrayResponse);

        if (
            !response[0].success ||
            !response[1].success ||
            !response[2].success ||
            !response[3].success
        )
            return createResponse(400, createContentError('Error al obtener las actividades'));

        if (response[0].message === 'No hay actividades registradas')
            return createResponse(400, response[0]);

        const dataRefactor = response[0].data.map((actividad) => {
            if (response[1].data) {
                let masterFinded = response[1].data.find((master) => actividad.id_master_task === master.UUID_master_task)
                if (masterFinded) actividad.id_master_task = {
                    uuid: masterFinded.UUID_master_task,
                    titulo: masterFinded.titulo_master_task,
                    publica: masterFinded.publicada_master_task
                }
            }

            if (response[2].data) {
                let areaFinded = response[2].data.find((areas) => actividad.para_area_task === areas.UUID_area)
                if (areaFinded) actividad.para_area_task = {
                    uuid: areaFinded.UUID_area,
                    nombre: areaFinded.nombre_area
                }
            }

            if (response[3].data) {
                let userFinded = response[3].data.find((user) => actividad.creada_por_task === user.UUID_user)
                if (userFinded) actividad.creada_por_task = {
                    uuid: userFinded.UUID_user,
                    correo: userFinded.correo_user
                }
                userFinded = response[3].data.find((user) => actividad.modificada_por_task === user.UUID_user)
                if (userFinded) actividad.modificada_por_task = {
                    uuid: userFinded.UUID_user,
                    correo: userFinded.correo_user
                }
            }
            return actividad
        })

        const dataFilter = dataRefactor.filter((task) => task.id_master_task.publica && task.estatus_task.trim().toUpperCase() !== 'CANCELADA');
        response[0].data = dataFilter.sort((a, b) => a.UUID_area > b.UUID_area ? -1 : 1);
        return createResponse(200, response[0]);
    }

    const getAllTaskByUuidMaster = async (uuid_master_task) => {
        const arrayFunctions = [
            {
                fctn: getActividadByIdMaestro,
                value: uuid_master_task,
            },
            { fctn: getAllMaestroActividades },
            { fctn: getAllAreas },
            { fctn: getAllUsers }
        ]
        const arrayResponse = arrayFunctions.map(async (functionExe) => {
            return !functionExe.value ? await functionExe.fctn() : await functionExe.fctn(functionExe.value);
        });
        const response = await Promise.all(arrayResponse);

        if (
            !response[0].success ||
            !response[1].success ||
            !response[2].success ||
            !response[3].success
        ) {
            if (!response[0].success) return createResponse(200, response[0]);
            const failedFinded = response.find((res) => !res.success)
            return createResponse(400, failedFinded);
        }
        if (response[0].message === 'No hay actividades registradas')
            return createResponse(400, response[0]);

        const dataRefactor = response[0].data.map((actividad) => {
            if (response[1].data) {
                let masterFinded = response[1].data.find((master) => actividad.id_master_task === master.UUID_master_task)
                if (masterFinded) actividad.id_master_task = {
                    uuid: masterFinded.UUID_master_task,
                    titulo: masterFinded.titulo_master_task,
                    publica: masterFinded.publicada_master_task
                }
            }

            if (response[2].data) {
                let areaFinded = response[2].data.find((areas) => actividad.para_area_task === areas.UUID_area)
                if (areaFinded) actividad.para_area_task = {
                    uuid: areaFinded.UUID_area,
                    nombre: areaFinded.nombre_area
                }
            }

            if (response[3].data) {
                let userFinded = response[3].data.find((user) => actividad.creada_por_task === user.UUID_user)
                if (userFinded) actividad.creada_por_task = {
                    uuid: userFinded.UUID_user,
                    correo: userFinded.correo_user
                }
                userFinded = response[3].data.find((user) => actividad.modificada_por_task === user.UUID_user)
                if (userFinded) actividad.modificada_por_task = {
                    uuid: userFinded.UUID_user,
                    correo: userFinded.correo_user
                }
            }
            return actividad
        })

        response[0].data = dataRefactor.sort((a, b) => a.UUID_area > b.UUID_area ? -1 : 1);
        return createResponse(200, response[0]);
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
        
        let existActividad = await verifyExistId(uuid);
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
        
        if (existActividad.data[0].estatus_task === bodyActividad.estatus_task) 
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
        getAllTaskByUuidMaster,
        getAllTaskWithoutInfo,
        getAllTaskEnabled,
        getAllTask,
        getTaskById,
        createNewActividad,
        updateDataActividad,
        updateActividadStatus,
        deleteOldActividad,
    }
})();

module.exports = servicesActividades;
