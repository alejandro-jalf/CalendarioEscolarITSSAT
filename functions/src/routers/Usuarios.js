const router = require("express").Router();
const {
    getAllUsuarios,
    getUsuario,
    createUsuario,
    loginUsuario,
    updateUsuario,
    updateUsuarioGeneral,
    updateCorreo,
    updateActivo,
    updateContra,
    deleteUsuario,
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
    const bodyLogin = req.body;
    const { correo_user } = req.params;
    const { status, response } = await loginUsuario(correo_user, bodyLogin);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:correo_user").put(async (req, res) => {
    const bodyUpdate = req.body;
    const { correo_user } = req.params;
    const { status, response } = await updateUsuario(correo_user, bodyUpdate);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:correo_user/general").put(async (req, res) => {
    const bodyUpdate = req.body;
    const { correo_user } = req.params;
    const { status, response } = await updateUsuarioGeneral(correo_user, bodyUpdate);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:correo_user/email").put(async (req, res) => {
    const bodyUpdate = req.body;
    const { correo_user } = req.params;
    const { status, response } = await updateCorreo(correo_user, bodyUpdate);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:correo_user/password").put(async (req, res) => {
    const bodyUpdatePassword = req.body;
    const { correo_user } = req.params;
    const { status, response } = await updateContra(correo_user, bodyUpdatePassword);
    res.status(status).json(response);
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
