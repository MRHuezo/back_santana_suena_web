const { Schema, model } = require('mongoose');

const sedeSchema = new Schema(
    {
        name: String,
        place: String,
        encargado:String,
        address: {
            street: String,
            number: String,
            postal_code: String
        },
        telefono: String,
        fecha_evento_final: Date,
        edicion: String,
        main: Boolean,
        mail: String,
        id_name: String
    },{
        timestamps: true,
    }
);


module.exports = model('sede',sedeSchema);