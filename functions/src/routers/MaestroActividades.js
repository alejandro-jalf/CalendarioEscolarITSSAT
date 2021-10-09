const router = require("express").Router();
const {
    getAllMasterTask,
    getMasterTaskById,
    createNewMasterTask,
    updateDataMasterTask,
    updateMasterTaskEnabled,
    deleteOldMasterTask,
} = require("../services");

router.route("/v1/maestroactividades").get(async (req, res) => {
    const { status, response } = await getAllMasterTask();
    res.status(status).json(response);
});

router.route("/v1/maestroactividades/:id_maestro").get(async (req, res) => {
    const { id_maestro } = req.params
    const { status, response } = await getMasterTaskById(id_maestro);
    res.status(status).json(response);
});

router.route("/v1/maestroactividades").post(async (req, res) => {
    const bodyMaestro = req.body
    const { status, response } = await createNewMasterTask(bodyMaestro);
    res.status(status).json(response);
});

router.route("/v1/maestroactividades/:id_maestro").post(async (req, res) => {
    const bodyMaestro = req.body;
    const { id_maestro } = req.params;
    const { status, response } = await updateDataMasterTask(id_maestro, bodyMaestro);
    res.status(status).json(response);
});

router.route("/v1/maestroactividades/:id_maestro/publica").put(async (req, res) => {
    const bodyMaestro = req.body;
    const { id_maestro } = req.params;
    const { status, response } = await updateMasterTaskEnabled(id_maestro, bodyMaestro);
    res.status(status).json(response);
});

router.route("/v1/maestroactividades/:id_maestro").delete(async (req, res) => {
    const { id_maestro } = req.params
    const { status, response } = await deleteOldMasterTask(id_maestro);
    res.status(status).json(response);
});

module.exports = router;
