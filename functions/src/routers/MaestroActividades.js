const router = require("express").Router();

router.route("/v1/maestroactividades").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Obtiene todas las listas de actividades en base de datos',
    });
});

router.route("/v1/maestroactividades/:id_maestro").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Obtiene una lista de actividades determinada',
    });
});

router.route("/v1/maestroactividades").post(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Crea una nueva lista de actividades',
    });
});

router.route("/v1/maestroactividades/:id_maestro").post(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Modifica una lista de usuarios determinada',
    });
});

router.route("/v1/maestroactividades/:id_maestro/publica").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Modifica si esta publica o no la lista de actividades',
    });
});

router.route("/v1/maestroactividades/:id_maestro").delete(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Elimina una lista de usuarios determinada',
    });
});

module.exports = router;
