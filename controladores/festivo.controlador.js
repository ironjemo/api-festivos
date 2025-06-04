

/*const FestivoRepositorio = require("../repositorios/festivo.repositorio");
const { obtenerFestivosPascua} = require("../servicios/servicioFechas");

function esFechaValida(anio, mes, dia) {
    anio = parseInt(anio);
    mes = parseInt(mes);
    dia = parseInt(dia);

    const fecha = new Date(anio, mes - 1, dia);
    return (
        fecha.getFullYear() === anio &&
        (fecha.getMonth() + 1) === mes &&
        fecha.getDate() === dia
    );
}

exports.verificar = (solicitud, respuesta) => {
    let { anio, mes, dia } = solicitud.params;

    // Convertir los valores a enteros
    anio = parseInt(anio);
    mes = parseInt(mes);
    dia = parseInt(dia);

    if (isNaN(anio) || isNaN(mes) || isNaN(dia)) {
        return respuesta.status(400).send({ mensaje: "Los parámetros deben ser números" });
    }

    if (!esFechaValida(anio, mes, dia)) {
        return respuesta.status(400).send({ mensaje: "Fecha no válida" });
    }

    FestivoRepositorio.verificar(anio, mes, dia, (error, mensaje) => {
        if (error) {
            return respuesta.status(500).send({ mensaje: "Error en la consulta", error });
        }
        return respuesta.json({ mensaje });
    });
};

// 🎯 NUEVA FUNCIÓN PARA CONSULTAR FESTIVOS
exports.obtenerFestivos = (solicitud, respuesta) => {
    const { anio } = solicitud.params;

    if (!anio || isNaN(anio) || anio < 1900 || anio > 2100) {
        return respuesta.status(400).send({ mensaje: "Año no válido" });
    }

    const festivos = obtenerFestivosPascua(parseInt(anio));

    return respuesta.json({ año: anio, festivos });
};*/

// festivo.controlador.js

const FestivoRepositorio = require("../repositorios/festivo.repositorio");
const { obtenerFestivosPascua, siguienteLunes } = require("../servicios/servicioFechas");

function esFechaValida(anio, mes, dia) {
    anio = parseInt(anio);
    mes = parseInt(mes);
    dia = parseInt(dia);

    const fecha = new Date(anio, mes - 1, dia);
    return (
        fecha.getFullYear() === anio &&
        (fecha.getMonth() + 1) === mes &&
        fecha.getDate() === dia
    );
}

// Función para verificar si una fecha es festiva
exports.verificar = (solicitud, respuesta) => {
    let { anio, mes, dia } = solicitud.params;

    anio = parseInt(anio);
    mes = parseInt(mes);
    dia = parseInt(dia);

    if (isNaN(anio) || isNaN(mes) || isNaN(dia)) {
        return respuesta.status(400).send({ mensaje: "Los parámetros deben ser números" });
    }

    if (!esFechaValida(anio, mes, dia)) {
        return respuesta.status(400).send({ mensaje: "Fecha no válida" });
    }

    FestivoRepositorio.verificar(anio, mes, dia, (error, mensaje) => {
        if (error) {
            return respuesta.status(500).send({ mensaje: "Error en la consulta", error });
        }
        return respuesta.json({ mensaje });
    });
};

// Lista de festivos fijos en Colombia
const festivosFijos = [
    { nombre: "Año nuevo", mes: 1, dia: 1, trasladable: false },
    { nombre: "Santos Reyes", mes: 1, dia: 6, trasladable: true },
    { nombre: "San José", mes: 3, dia: 19, trasladable: true },
    { nombre: "Día del trabajo", mes: 5, dia: 1, trasladable: false },
    { nombre: "La Asunción", mes: 8, dia: 15, trasladable: true },
    { nombre: "Día de la Raza", mes: 10, dia: 12, trasladable: true },
    { nombre: "Todos los Santos", mes: 11, dia: 1, trasladable: true },
    { nombre: "Independencia de Cartagena", mes: 11, dia: 11, trasladable: true },
    { nombre: "Navidad", mes: 12, dia: 25, trasladable: false }
];

// Función para obtener todos los festivos de un año
exports.obtenerFestivos = (solicitud, respuesta) => {
    const { anio } = solicitud.params;

    if (!anio || isNaN(anio) || anio < 1900 || anio > 2100) {
        return respuesta.status(400).send({ mensaje: "Año no válido" });
    }

    const año = parseInt(anio);
    const festivos = [];

    // Agregar festivos fijos (con traslado si aplica)
    festivosFijos.forEach(f => {
        const fecha = new Date(año, f.mes - 1, f.dia);
        const final = f.trasladable ? siguienteLunes(new Date(fecha)) : fecha;

        festivos.push({
            festivo: f.nombre,
            fecha: final.toISOString().split("T")[0]
        });
    });

    // Agregar festivos variables (derivados de la Pascua)
    const festivosVariables = obtenerFestivosPascua(año);
    for (const nombre in festivosVariables) {
        festivos.push({
            festivo: nombre,
            fecha: festivosVariables[nombre].toISOString().split("T")[0]
        });
    }

    // Ordenar por fecha
    festivos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return respuesta.status(200).json(festivos);
};

