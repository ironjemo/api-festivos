

/*const FestivoRepositorio = require("../repositorios/festivo.repositorio");

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


*/

const FestivoRepositorio = require("../repositorios/festivo.repositorio");
const { obtenerFestivosPascua } = require("../servicios/servicioFechas");

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
};
