
const FestivoRepositorio = require("../repositorios/festivo.repositorio");

function esFechaValida(anio, mes, dia) {
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.getFullYear() == anio && (fecha.getMonth() + 1) == mes && fecha.getDate() == dia;
}

exports.verificar = (solicitud, respuesta) => {
    const { anio, mes, dia } = solicitud.params;

    if (!esFechaValida(anio, mes, dia)) {
        return respuesta.status(400).send({ mensaje: "Fecha No válida" });
    }

    FestivoRepositorio.verificar(anio, mes, dia, (error, mensaje) => {
        if (error) {
            return respuesta.status(500).send({ mensaje: "Error en la consulta" });
        }
        return respuesta.send({ mensaje });
    });
};

