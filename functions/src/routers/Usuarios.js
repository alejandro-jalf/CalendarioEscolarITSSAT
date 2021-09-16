const router = require("express").Router();

router.route("/v1/usuarios").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Ruta principal de usuarios',
    });
});

module.exports = router;
