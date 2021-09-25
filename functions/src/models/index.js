const admin = require("firebase-admin");
admin.initializeApp();

const modelsUsuarios = require('./ModelUsuarios')

const models = {
    ...modelsUsuarios
}

module.exports = models;
