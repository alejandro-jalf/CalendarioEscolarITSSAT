const router = require("express").Router();

router.route("/v1/actividades").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Ruta principal de actividades',
    });
});

module.exports = router;
