const express = require("express");
const app = express();//Instancia de la aplicacion,asigna el objeto express
const bd = require("./repositorios/bd");

bd.conectar().catch(error => console.error("Error conectando a la BD:", error));

require("./rutas/festivo.rutas")(app);

const puerto = 3030;
app.listen(puerto, () => {
    console.log(`✅ API Festivos ejecutándose en http://localhost:${puerto}`);//Arranca el loop infinito
});
