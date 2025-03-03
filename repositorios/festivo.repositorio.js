const bd = require("./bd");

const FestivoRepositorio = {};

FestivoRepositorio.verificar = async (anio, mes, dia, respuesta) => {
    const basedatos = bd.obtenerBD();
    try {
        const fecha = `${anio}/${mes}/${dia}`; // Mantiene el formato esperado

        console.log(`🔍 Buscando la fecha: ${fecha} en la colección "tipos"`);

        
            const resultado = await basedatos.collection("tipos")
    .findOne({ "festivos.dia": parseInt(dia), "festivos.mes": parseInt(mes) });


        if (resultado) {
            respuesta(null, "Es festivo");
        } else {
            respuesta(null, "No es festivo");
        }
    } catch (error) {
        respuesta(error, null);
    }
};

module.exports = FestivoRepositorio;

