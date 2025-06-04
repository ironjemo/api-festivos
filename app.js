const express = require("express");
const app = express();
const conexion = require("./conexion");

// Middleware para recibir JSON
app.use(express.json());

// Conexión a la base de datos y arranque del servidor
conexion.conectar().then(() => {
    console.log("✅ Base de datos conectada correctamente");

    // Rutas
    app.use("/api/calendario", require("./rutas/calendario.rutas"));

    // Inicio del servidor en puerto 3030
    app.listen(3030, () => {
        console.log("🚀 Servidor escuchando en el puerto 3030");
    });
}).catch((err) => {
    console.error("❌ Error al conectar a la base de datos:", err);
});
