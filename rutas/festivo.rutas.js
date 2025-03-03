module.exports = (app) => {
    const controlador = require("../controladores/festivo.controlador");

    app.get("/festivos/verificar/:anio/:mes/:dia", controlador.verificar);
};
