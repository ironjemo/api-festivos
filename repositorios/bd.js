const { MongoClient } = require("mongodb");//libreria de mongobd, y el objeto que ya dispone la funcionalidad
const configBD = require("../configuracion/bd.config");//Archivo de configuracion

const url = `mongodb://${configBD.SERVIDOR}:${configBD.PUERTO}`;//Cadena de conexion al servidor mongobd
const cliente = new MongoClient(url);
let basedatos;

module.exports = {
    conectar: async () => {
        try {
            await cliente.connect();
            console.log("✅ Conectado a la base de datos");
            basedatos = cliente.db(configBD.BASEDATOS);
        } catch (error) {
            console.error("❌ Error en la conexión a la BD:", error);
        }
    },
    obtenerBD: () => basedatos
};
