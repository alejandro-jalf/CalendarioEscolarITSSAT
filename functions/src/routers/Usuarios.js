const router = require("express").Router();
const {
    getAllUsuarios,
    getUsuario,
    createUsuario,
} = require('../services')

router.route("/v1/usuarios").get(async (req, res) => {
    const { status, response } = await getAllUsuarios();
    res.status(status).json(response);
});

router.route("/v1/usuarios/:correo_user").get(async (req, res) => {
    const { correo_user } = req.params
    const { status, response } = await getUsuario(correo_user);
    res.status(status).json(response);
});

router.route("/v1/usuarios").post(async (req, res) => {
    const bodyUsuarios = req.body
    const { status, response } = await createUsuario(bodyUsuarios);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:correo_user/login").post(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'loguea a un usuario',
    });
});

router.route("/v1/usuarios/:correo_user").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Modifica un determinado usuario',
    });
});

router.route("/v1/usuarios/:correo_user/general").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Modifica los datos generales de un usuario',
    });
});

router.route("/v1/usuarios/:correo_user/email").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Modifica el correo de un usuario',
    });
});

router.route("/v1/usuarios/:correo_user/password").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Cambia la contraseña de un usuario',
    });
});

router.route("/v1/usuarios/:correo_user/recovery").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Recupera cuenta de un usuario',
    });
});

router.route("/v1/usuarios/:correo_user/status").put(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Cambia el status activo de un usuario',
    });
});

router.route("/v1/usuarios/:correo_user").delete(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Elimina un usuario',
    });
});

module.exports = router;
