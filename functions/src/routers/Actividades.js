const router = require("express").Router();
const {
    getAllTask,
    getTaskById,
    createNewActividad,
    updateDataActividad,
    updateActividadStatus,
    deleteOldActividad,
    getAllTaskWithoutInfo,
} = require("../services");

router.route("/v1/actividades").get(async (req, res) => {
    const { status, response } = await getAllTask();
    res.status(status).json(response);
});

router.route("/v1/actividades/sinrelacion").get(async (req, res) => {
    const { status, response } = await getAllTaskWithoutInfo();
    res.status(status).json(response);
});

router.route("/v1/actividades/:id_actividad").get(async (req, res) => {
    const { id_actividad } = req.params
    const { status, response } = await getTaskById(id_actividad);
    res.status(status).json(response);
});

router.route("/v1/actividades").post(async (req, res) => {
    const bodyActividad = req.body
    const { status, response } = await createNewActividad(bodyActividad);
    res.status(status).json(response);
});

router.route("/v1/actividades/:id_actividad").put(async (req, res) => {
    const bodyActividad = req.body;
    const { id_actividad } = req.params;
    const { status, response } = await updateDataActividad(id_actividad, bodyActividad);
    res.status(status).json(response);
});

router.route("/v1/actividades/:id_actividad/status").put(async (req, res) => {
    const bodyActividad = req.body;
    const { id_actividad } = req.params;
    const { status, response } = await updateActividadStatus(id_actividad, bodyActividad);
    res.status(status).json(response);
});

router.route("/v1/actividades/:id_actividad").delete(async (req, res) => {
    const { id_area } = req.params
    const { status, response } = await deleteOldActividad(id_area);
    res.status(status).json(response);
});

module.exports = router;
