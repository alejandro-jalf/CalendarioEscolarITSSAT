const functions = require('firebase-functions');
require("mandatoryenv").load();

const token = (functions.config().token) ? functions.config().token.key : process.env.CEITSSAT_TOKEN;
const origin1 = (functions.config().origin1) ? functions.config().origin1.key : process.env.CEITSSAT_ORIGIN1;
const origin2 = (functions.config().origin1) ? functions.config().origin2.key : process.env.CEITSSAT_ORIGIN2;
const origin3 = (functions.config().origin1) ? functions.config().origin3.key : process.env.CEITSSAT_ORIGIN3;
const origin4 = (functions.config().origin1) ? functions.config().origin4.key : process.env.CEITSSAT_ORIGIN4;
const origin5 = (functions.config().origin1) ? functions.config().origin5.key : process.env.CEITSSAT_ORIGIN5;
const user = (functions.config().user) ? functions.config().user.key : process.env.CEITSSAT_USER;
const password = (functions.config().password) ? functions.config().password.key : process.env.CEITSSAT_PASSWORD;

module.exports = {
    token,
    listOriginAccept: [ origin1, origin2, origin3, origin4, origin5 ],
    user,
    password,
}