const router = require("express").Router();

router.route("/v1/categorias").get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Ruta principal de categorias',
    });
});

module.exports = router;
