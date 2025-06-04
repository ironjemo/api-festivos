const repositorio = require("../repositorios/tipo.repositorio");

module.exports = {
    listar: async (req, res) => {
        try {
            const datos = await repositorio.listar();
            res.json(datos);
        } catch (error) {
            res.status(500).json({ mensaje: "❌ Error al listar tipos", error });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const tipo = await repositorio.buscarPorId(req.params.id);
            if (tipo) {
                res.json(tipo);
            } else {
                res.status(404).json({ mensaje: "Tipo no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ mensaje: "❌ Error al buscar tipo", error });
        }
    },

    insertar: async (req, res) => {
        try {
            const idInsertado = await repositorio.insertar(req.body);
            res.status(201).json({ mensaje: "✅ Tipo insertado", id: idInsertado });
        } catch (error) {
            res.status(500).json({ mensaje: "❌ Error al insertar tipo", error });
        }
    },

    actualizar: async (req, res) => {
        try {
            const actualizado = await repositorio.actualizar(req.params.id, req.body);
            if (actualizado) {
                res.json({ mensaje: "✅ Tipo actualizado" });
            } else {
                res.status(404).json({ mensaje: "Tipo no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ mensaje: "❌ Error al actualizar tipo", error });
        }
    },

    eliminar: async (req, res) => {
        try {
            const eliminado = await repositorio.eliminar(req.params.id);
            if (eliminado) {
                res.json({ mensaje: "✅ Tipo eliminado" });
            } else {
                res.status(404).json({ mensaje: "Tipo no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ mensaje: "❌ Error al eliminar tipo", error });
        }
    }
};
