const router = require("express").Router();

router.route("/v1/actividades").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Obtiene todas las actividades almacenadas en base de datos',
    });
});

router.route("/v1/actividades/:id_actividad").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Obtiene una actividad determinada',
    });
});

router.route("/v1/actividades").post(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Crea una nueva actividad',
    });
});

router.route("/v1/actividades/:id_actividad").post(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Modifica los datos de una actividad determinada',
    });
});

router.route("/v1/actividades/:id_actividad/activa").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Cambia el estatus de la actividad puede enviar true o false',
    });
});

router.route("/v1/actividades/:id_actividad").delete(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Elimina una actividad en especifico',
    });
});

module.exports = router;
