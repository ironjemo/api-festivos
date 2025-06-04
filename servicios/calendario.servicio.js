const Calendario = require("../modelos/calendario.modelo");
const Tipo = require("../modelos/tipo.modelo");
const { obtenerFestivosPascua } = require("./servicioFechas");

async function generarCalendario(anio) {
    try {
        const festivosPascua = obtenerFestivosPascua(anio);

        // Obtener todos los tipos desde la base de datos
        const tipos = await Tipo.find();
        const tipoMap = {};
        tipos.forEach(t => tipoMap[t.tipo.toLowerCase()] = t._id);

        if (!tipoMap["día festivo"] || !tipoMap["día laboral"] || !tipoMap["fin de semana"]) {
            throw new Error("Faltan tipos en la colección 'tipo'");
        }

        const festivosSet = new Set(
            Object.values(festivosPascua).map(f => f.toISOString().split("T")[0])
        );

        const registros = [];
        for (let mes = 0; mes < 12; mes++) {
            for (let dia = 1; dia <= 31; dia++) {
                const fecha = new Date(anio, mes, dia);
                if (fecha.getMonth() !== mes) continue; // Saltar fechas inválidas

                const fechaISO = fecha.toISOString().split("T")[0];
                const diaSemana = fecha.getDay(); // 0 = domingo, 6 = sábado
                let tipo;
                let descripcion;

                if (festivosSet.has(fechaISO)) {
                    tipo = tipoMap["día festivo"];
                    descripcion = "Día festivo";
                } else if (diaSemana === 0 || diaSemana === 6) {
                    tipo = tipoMap["fin de semana"];
                    descripcion = "Fin de semana";
                } else {
                    tipo = tipoMap["día laboral"];
                    descripcion = "Día laboral";
                }

                registros.push({
                    fecha,
                    idTipo: tipo,
                    descripcion
                });
            }
        }

        await Calendario.deleteMany({ fecha: { $gte: new Date(anio, 0, 1), $lte: new Date(anio, 11, 31) } });
        await Calendario.insertMany(registros);

        return true;
    } catch (error) {
        console.error("❌ Error generando calendario:", error);
        return false;
    }
}

module.exports = {
    generarCalendario
};
