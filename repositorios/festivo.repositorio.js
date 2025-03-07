

const bd = require("./bd");
const { obtenerFestivosPascua } = require("../servicios/servicioFechas");

const FestivoRepositorio = {};

// ✅ Función corregida con validaciones
FestivoRepositorio.verificar = async (anio, mes, dia, respuesta) => {
    if (typeof respuesta !== "function") {
        console.error("❌ Error: `respuesta` no es una función válida.");
        return;
    }

    const basedatos = bd.obtenerBD();
    try {
        const fechaConsulta = new Date(anio, mes - 1, dia);
        console.log(`🔍 Buscando la fecha: ${fechaConsulta.toISOString().split('T')[0]}`);

        // 🔵 1. Buscar en la base de datos
        const resultado = await basedatos.collection("tipos")
            .findOne({ "festivos.dia": parseInt(dia), "festivos.mes": parseInt(mes) });

        if (resultado) {
            return respuesta(null, "Es festivo");
        }

        // 🔵 2. Buscar en los festivos basados en Pascua
        const festivosPascua = obtenerFestivosPascua(anio);
        for (const [nombre, fecha] of Object.entries(festivosPascua)) {
            if (fecha.getDate() === fechaConsulta.getDate() && fecha.getMonth() === fechaConsulta.getMonth()) {
                return respuesta(null, `Es festivo (${nombre})`);
            }
        }

        return respuesta(null, "No es festivo");
    } catch (error) {
        console.error("❌ Error en la consulta:", error);
        return respuesta(error, null);
    }
};

// ✅ Exportación corregida
module.exports = FestivoRepositorio;

