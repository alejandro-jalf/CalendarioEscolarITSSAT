const router = require("express").Router();
const {
    getAreas,
    getArea,
    createNewArea,
    updateDataArea,
    updateAreaActiva,
    deleteOldArea,
} = require("../services");

router.route("/v1/areas").get(async (req, res) => {
    const { status, response } = await getAreas();
    res.status(status).json(response);
});

router.route("/v1/areas/:id_area").get(async (req, res) => {
    const { id_area } = req.params
    const { status, response } = await getArea(id_area);
    res.status(status).json(response);
});

router.route("/v1/areas").post(async (req, res) => {
    const bodyArea = req.body
    const { status, response } = await createNewArea(bodyArea);
    res.status(status).json(response);
});

router.route("/v1/areas/:id_area").put(async (req, res) => {
    const bodyArea = req.body;
    const { id_area } = req.params;
    const { status, response } = await updateDataArea(id_area, bodyArea);
    res.status(status).json(response);
});

router.route("/v1/areas/:id_area/activa").put(async (req, res) => {
    const bodyArea = req.body;
    const { id_area } = req.params;
    const { status, response } = await updateAreaActiva(id_area, bodyArea);
    res.status(status).json(response);
});

router.route("/v1/areas/:id_area").delete(async (req, res) => {
    const { id_area } = req.params
    const { status, response } = await deleteOldArea(id_area);
    res.status(status).json(response);
});

module.exports = router;
