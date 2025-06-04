const moment = require("moment");
const conexion = require("../conexion");

// 🔗 Referencia a la colección "calendario" en MongoDB
const coleccion = () => conexion.getDB().collection("calendario");

// 🗓️ Festivos fijos (no se trasladan)
const festivosFijos = [
    { nombre: "Año Nuevo", mes: 1, dia: 1, tipo: "civil" },
    { nombre: "Día del Trabajo", mes: 5, dia: 1, tipo: "civil" },
    { nombre: "Independencia de Colombia", mes: 7, dia: 20, tipo: "patrio" },
    { nombre: "Batalla de Boyacá", mes: 8, dia: 7, tipo: "patrio" },
    { nombre: "Inmaculada Concepción", mes: 12, dia: 8, tipo: "religioso" },
    { nombre: "Navidad", mes: 12, dia: 25, tipo: "religioso" }
];

// 🗓️ Festivos que se trasladan al lunes (Ley Emiliani)
const festivosALunes = [
    { nombre: "Epifanía", mes: 1, dia: 6 },
    { nombre: "San José", mes: 3, dia: 19 },
    { nombre: "San Pedro y San Pablo", mes: 6, dia: 29 },
    { nombre: "Asunción de la Virgen", mes: 8, dia: 15 },
    { nombre: "Día de la Raza", mes: 10, dia: 12 },
    { nombre: "Todos los Santos", mes: 11, dia: 1 },
    { nombre: "Independencia de Cartagena", mes: 11, dia: 11 }
];

// 🔁 Mueve una fecha al lunes siguiente si no cae en lunes
function moverAlLunes(fecha) {
    const diaSemana = fecha.isoWeekday(); // lunes = 1, domingo = 7
    if (diaSemana === 1) return fecha;
    return fecha.add(8 - diaSemana, "days");
}

// ✝️ Cálculo de la fecha de Pascua (algoritmo de Meeus/Jones/Butcher)
function calcularPascua(anio) {
    const a = anio % 19;
    const b = Math.floor(anio / 100);
    const c = anio % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return moment(`${anio}-${mes}-${dia}`, "YYYY-M-D");
}

module.exports = {
    // 📋 Lista todo el calendario completo
    listar: async () => {
        return await coleccion().find().toArray();
    },

    // 🔍 Busca un día por ID
    buscarPorId: async (id) => {
        const { ObjectId } = require("mongodb");
        return await coleccion().findOne({ _id: new ObjectId(id) });
    },

    // ➕ Crea un nuevo día en el calendario
    crear: async (objeto) => {
        return await coleccion().insertOne(objeto);
    },

    // ✏️ Actualiza un día existente
    actualizar: async (id, objeto) => {
        const { ObjectId } = require("mongodb");
        return await coleccion().updateOne({ _id: new ObjectId(id) }, { $set: objeto });
    },

    // ❌ Elimina un día
    eliminar: async (id) => {
        const { ObjectId } = require("mongodb");
        return await coleccion().deleteOne({ _id: new ObjectId(id) });
    },

    // 📅 Lista los días de un año específico
    listarPorAnio: async (anio) => {
        const inicio = new Date(`${anio}-01-01T00:00:00.000Z`);
        const fin = new Date(`${anio}-12-31T23:59:59.999Z`);
        return await coleccion().find({
            fecha: { $gte: inicio, $lte: fin }
        }).toArray();
    },

    // 🧠 Genera todo el calendario para un año (festivos, fines de semana y laborales)
    generar: async (anio) => {
        const dias = [];

        // 🧱 Festivos fijos
        festivosFijos.forEach(f => {
            const fecha = moment(`${anio}-${f.mes}-${f.dia}`, "YYYY-M-D");
            dias.push({
                fecha: fecha.toDate(),
                tipo: "Día festivo",
                descripcion: f.nombre
            });
        });

        // 🔁 Festivos trasladables
        festivosALunes.forEach(f => {
            const fechaOriginal = moment(`${anio}-${f.mes}-${f.dia}`, "YYYY-M-D");
            const fechaLunes = moverAlLunes(fechaOriginal);
            dias.push({
                fecha: fechaLunes.toDate(),
                tipo: "Día festivo",
                descripcion: f.nombre + " (trasladado)"
            });
        });

        // ✝️ Festivos religiosos dependientes de Pascua
        const pascua = calcularPascua(anio);
        const festivosReligiosos = [
            { nombre: "Jueves Santo", offset: -3 },
            { nombre: "Viernes Santo", offset: -2 },
            { nombre: "Ascensión del Señor", offset: 43, trasladar: true },
            { nombre: "Corpus Christi", offset: 64, trasladar: true },
            { nombre: "Sagrado Corazón", offset: 71, trasladar: true }
        ];

        festivosReligiosos.forEach(f => {
            let fecha = pascua.clone().add(f.offset, "days");
            if (f.trasladar) fecha = moverAlLunes(fecha);
            dias.push({
                fecha: fecha.toDate(),
                tipo: "Día festivo",
                descripcion: f.nombre + (f.trasladar ? " (trasladado)" : "")
            });
        });

        // 🧾 Rellenar el resto del año con días laborales y fines de semana
        const inicio = moment(`${anio}-01-01`);
        const fin = moment(`${anio}-12-31`);
        let actual = inicio.clone();

        while (actual.isSameOrBefore(fin)) {
            const yaExiste = dias.some(d => moment(d.fecha).isSame(actual, "day"));
            if (!yaExiste) {
                const tipo = actual.day() === 0 || actual.day() === 6 ? "Fin de semana" : "Día laboral";
                const descripcion = actual.format("dddd"); // nombre del día
                dias.push({
                    fecha: actual.toDate(),
                    tipo,
                    descripcion
                });
            }
            actual.add(1, "day");
        }

        // 🧮 Ordenar días por fecha
        dias.sort((a, b) => a.fecha - b.fecha);

        // 🔁 Eliminar días previos del año y cargar los nuevos
        await coleccion().deleteMany({
            fecha: { $gte: new Date(`${anio}-01-01`), $lte: new Date(`${anio}-12-31`) }
        });
        await coleccion().insertMany(dias);
    }
};
