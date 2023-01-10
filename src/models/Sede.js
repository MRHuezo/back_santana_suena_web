const { Schema, model } = require('mongoose');

const sedeSchema = new Schema(
    {
        name: String,
        place: String,
        address: {
            street: String
            number: String
            postal_code: String
        },
        telefono: String,
        fecha_evento_final: Date,
        user_login:String,
        password:String,
        main: Boolean
        
    },{
        timestamps: true,
    }
);


module.exports = model('sede',sedeSchema);