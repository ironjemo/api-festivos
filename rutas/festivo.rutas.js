/*module.exports = (app) => {
    const controlador = require("../controladores/festivo.controlador");

    app.get("/festivos/verificar/:anio/:mes/:dia", controlador.verificar);
};
*/

module.exports = (app) => { 
    const controlador = require("../controladores/festivo.controlador");

    // Ruta para verificar si una fecha es festiva
    app.get("/festivos/verificar/:anio/:mes/:dia", controlador.verificar);

    // Nueva ruta para obtener todos los festivos de un año
    app.get("/festivos/:anio", controlador.obtenerFestivos);
};


