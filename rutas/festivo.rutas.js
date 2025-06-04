
module.exports = (app) => {
    const controlador = require("../controladores/festivo.controlador");

    // Ruta para verificar si una fecha es festiva
    app.get("/festivos/verificar/:anio/:mes/:dia", controlador.verificar);

    // Ruta para obtener todos los festivos de un año 
    app.get("/festivos/:anio", controlador.obtenerFestivos);

    // ✅ Nueva ruta con formato /festivos/obtener/:anio 
    app.get("/festivos/obtener/:anio", controlador.obtenerFestivos);
};

