const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArchivoSchema = new Schema({
    tipo: {
        type: String,
        required: [true, 'El tipo de archivo es requerido']
    },
    url: {
        type: String,
        required: [true, 'La url es requerida']
    },
    path: {
        type: String,
        required: [true, 'Se debe proporcionar el PATH del archivo']
    },
    nombre: {
        type: String
    },
    documentoID: {
        type: Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Archivo', ArchivoSchema);