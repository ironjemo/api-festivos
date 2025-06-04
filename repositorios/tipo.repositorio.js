const { ObjectId } = require("mongodb");
const bd = require("./bd");

const coleccion = "tipo";

module.exports = {
    listar: async () => {
        const db = bd.obtenerBD();
        return await db.collection(coleccion).find().toArray();
    },

    buscarPorId: async (id) => {
        const db = bd.obtenerBD();
        return await db.collection(coleccion).findOne({ _id: new ObjectId(id) });
    },

    insertar: async (tipo) => {
        const db = bd.obtenerBD();
        const resultado = await db.collection(coleccion).insertOne(tipo);
        return resultado.insertedId;
    },

    actualizar: async (id, datos) => {
        const db = bd.obtenerBD();
        const resultado = await db.collection(coleccion).updateOne(
            { _id: new ObjectId(id) },
            { $set: datos }
        );
        return resultado.modifiedCount > 0;
    },

    eliminar: async (id) => {
        const db = bd.obtenerBD();
        const resultado = await db.collection(coleccion).deleteOne({ _id: new ObjectId(id) });
        return resultado.deletedCount > 0;
    }
};
