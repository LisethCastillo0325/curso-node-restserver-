const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoImagenesSchema = new Schema({
    url: {
        type: String,
        required: [true, 'La url es requerida']
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    }
});

module.exports = mongoose.model('ProductoImagenes', ProductoImagenesSchema);