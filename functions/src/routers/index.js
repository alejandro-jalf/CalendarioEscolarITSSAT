const router = require("express").Router();

router.use(require("./Usuarios"));
router.use(require("./Actividades"));
router.use(require("./Categorias"));

module.exports = router;
