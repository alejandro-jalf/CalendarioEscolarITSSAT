const router = require("express").Router();

router.route("/v1/areas").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Obtiene todas las areas en base de datos',
    });
});

router.route("/v1/areas/:id_area").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Obtiene un area determinada',
    });
});

router.route("/v1/areas").post(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Crea una nueva area',
    });
});

router.route("/v1/areas/:id_area").post(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Modifica los datos de un area determinada',
    });
});

router.route("/v1/areas/:id_area/activa").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Modifica los datos de un area determinada',
    });
});

router.route("/v1/areas/:id_area").delete(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Elimina un area determinada',
    });
});

module.exports = router;
