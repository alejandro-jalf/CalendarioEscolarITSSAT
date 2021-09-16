const { inject, errorHandler } = require("express-custom-error");
const { validateOrigin } = require("./src/middlewares");
const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors");
inject()
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true }));

app.use("*", (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.use(validateOrigin);

app.use("*", (req, res, next) => {
    if (typeof req.body === "string") {
        req.body = JSON.parse(req.body);
    }
    next();
});

app.use("/", require("./src/routers"));

app.use(errorHandler());
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "La ruta no existe"
    })
});

exports.api = functions.https.onRequest(app);
