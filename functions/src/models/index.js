const admin = require("firebase-admin");
admin.initializeApp();

const modelsMaestroActividades = require('./ModelMaestroActividades');
const modelsActividades = require('./ModelActividades');
const modelsUsuarios = require('./ModelUsuarios');
const modelsAreas = require('./ModelAreas');

const models = {
    ...modelsMaestroActividades,
    ...modelsActividades,
    ...modelsUsuarios,
    ...modelsAreas,
}

module.exports = models;
