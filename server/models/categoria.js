const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaShema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripcion es requerida']
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    }
});
categoriaShema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Categoria', categoriaShema);