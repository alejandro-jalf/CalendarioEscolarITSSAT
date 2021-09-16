const { token, listOriginAccept } = require("../configs");

const middlewares = (() => {
    const validateOrigin = (req, res, next) => {
        try {
            const origin = req.get("origin");
            const tokenHeader = req.headers['access-token'];
            if (tokenHeader || origin) {
                const originIsWhitelisted = listOriginAccept.indexOf(origin) !== -1;
                if (tokenHeader !== token && !originIsWhitelisted) {
                    res.status(401).json({
                        success: false,
                        message: "token u origen no valido"
                    });
                    return;
                }
                next();
                return
            } else {
                res.status(400).json({
                    success: false,
                    message: "se requiere de token"
                });
            }
        } catch (error) {
            res.status(401).json({
                success: false,
                message: "Error al consultar el token"
            });
        }
    };

    return {
        validateOrigin,
    }
})();

module.exports = middlewares;
