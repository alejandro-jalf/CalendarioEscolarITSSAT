const router = require("express").Router();

router.use(require("./Usuarios"));
router.use(require("./Actividades"));
router.use(require("./Areas"));
router.use(require("./MaestroActividades"));

module.exports = router;
