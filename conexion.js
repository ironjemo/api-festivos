const { MongoClient } = require("mongodb");

// Dirección del contenedor MongoDB (ajustado para entorno Docker)
const url = "mongodb://dockerbdnewcalendario:27017";

// Instancia del cliente MongoDB
const client = new MongoClient(url);

// Variable para guardar la instancia de la base de datos
let db = null;

/**
 * Conecta al servidor de MongoDB y selecciona la base de datos "festivos".
 * Esta función se debe llamar una sola vez al iniciar la aplicación.
 */
async function conectar() {
    if (!db) {
        await client.connect(); // Conexión al servidor MongoDB
        db = client.db("festivos"); // Nombre de la base de datos
        console.log("✅ Conectado a MongoDB (Base de datos: festivos)");
    }
    return db;
}

/**
 * Devuelve la instancia actual de la base de datos.
 * Si aún no se ha conectado, lanza un error.
 */
function getDB() {
    if (!db) {
        throw new Error("❌ Debes llamar primero a conectar() antes de usar getDB()");
    }
    return db;
}

// Exportar funciones para poder usarlas en otras partes del proyecto
module.exports = {
    conectar,
    getDB
};
