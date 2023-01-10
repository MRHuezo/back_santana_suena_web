const { Schema, model } = require('mongoose');

const participanteSchema = new Schema(
    {
        name: String,
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
         },
        address: {
            street: String
            number: String
            postal_code: String
        },
        mail:{
            type: String,
            unique: true,
            trim: true,
        },
        comprobante_pago: String,
        identificacion_personal: String,
        telefono: String
    },{
        timestamps: true,
    }
);


module.exports = model('participante',sedeSchema);