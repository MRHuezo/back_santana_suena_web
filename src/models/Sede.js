const { Schema, model } = require('mongoose');

const sedeSchema = new Schema(
    {
        name: String,
        place: String,
        imagen: String,
        address: {
            street: String,
            number: String,
            postal_code: String
        },
        telefono: String,
        fecha_evento_final: Date,
        edicion: String,
        email: String,
        user_login:String,
        password:String,
        main: Boolean
        
    },{
        timestamps: true,
    }
);


module.exports = model('sede',sedeSchema);