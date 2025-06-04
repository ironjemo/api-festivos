// Importamos el repositorio que contiene la lógica para acceder a la base de datos
const repo = require("../repositorios/calendario.repositorio");

// Controlador para listar todos los registros del calendario
exports.listar = async (req, res) => {
    try {
        const lista = await repo.listar(); // Obtenemos todos los registros desde el repositorio
        res.json(lista); // Enviamos la lista como respuesta JSON
    } catch (err) {
        res.status(500).json({ mensaje: "Error al listar", error: err }); // Error genérico
    }
};

// Controlador para crear un nuevo registro en el calendario
exports.crear = async (req, res) => {
    try {
        const creado = await repo.crear(req.body); // Creamos el nuevo registro con los datos enviados
        res.status(201).json(creado); // Devolvemos el recurso creado con status 201
    } catch (err) {
        res.status(500).json({ mensaje: "Error al crear", error: err }); // Error genérico
    }
};

// Controlador para buscar un registro por su ID
exports.buscarPorId = async (req, res) => {
    try {
        const encontrado = await repo.buscarPorId(req.params.id); // Buscamos por ID desde el repositorio
        if (!encontrado) return res.status(404).json({ mensaje: "No encontrado" }); // Si no se encuentra, devolvemos 404
        res.json(encontrado); // Si se encuentra, lo devolvemos como JSON
    } catch (err) {
        res.status(500).json({ mensaje: "Error al buscar", error: err }); // Error genérico
    }
};

// Controlador para actualizar un registro por su ID
exports.actualizar = async (req, res) => {
    try {
        const actualizado = await repo.actualizar(req.params.id, req.body); // Actualizamos el registro con los nuevos datos
        res.json(actualizado); // Devolvemos el recurso actualizado
    } catch (err) {
        res.status(500).json({ mensaje: "Error al actualizar", error: err }); // Error genérico
    }
};

// Controlador para eliminar un registro por su ID
exports.eliminar = async (req, res) => {
    try {
        await repo.eliminar(req.params.id); // Eliminamos el registro
        res.json({ mensaje: "Eliminado correctamente" }); // Confirmamos la eliminación
    } catch (err) {
        res.status(500).json({ mensaje: "Error al eliminar", error: err }); // Error genérico
    }
};

// Controlador para generar automáticamente un calendario para un año dado
exports.generarCalendario = async (req, res) => {
    try {
        const anio = parseInt(req.params.anio); // Convertimos el parámetro de año a número
        await repo.generar(anio); // Llamamos al repositorio para generar el calendario
        res.json(true); // Confirmamos que se generó exitosamente
    } catch (err) {
        res.status(500).json({ mensaje: "Error al generar calendario", error: err }); // Error genérico
    }
};

// ✅ Controlador para listar el calendario por año con manejo de errores y validación
exports.listarPorAnio = async (req, res) => {
    try {
        const anio = parseInt(req.params.anio); // 📌 Convertimos el parámetro de la URL a número
        console.log("🔍 Año recibido en la URL:", anio); // 👀 Mostramos el año en consola para debugging

        if (isNaN(anio)) {
            // ❌ Si no es un número válido, respondemos con error 400
            return res.status(400).json({ mensaje: "El año proporcionado no es válido." });
        }

        const calendario = await repo.listarPorAnio(anio); // ✅ Obtenemos los días del calendario para ese año
        res.json(calendario); // 📤 Enviamos el resultado como JSON
    } catch (err) {
        // 🐞 Mostramos en consola cualquier error que ocurra
        console.error("❌ Error en listarPorAnio:", err);

        // ❗ Enviamos el mensaje de error al cliente con status 500
        res.status(500).json({ mensaje: "Error al listar calendario por año", error: err.message || err });
    }
};
