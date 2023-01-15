const { Schema, model } = require('mongoose');

const participanteSchema = new Schema(
    {
        name: String,
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
         },
        address: {
            street: String,
            number: String,
            postal_code: String
        },
        mail:{
            type: String,
            unique: true,
            trim: true,
        },
        url_video:String,
        comprobante_pago: String,
        identificacion_personal: String,
        telefono: String,
        nombre_tema: String,
        experiencia_artistica: String,
        lugar_origen: String,
        fecha_nacimiento: String,
        genero: String
      
    },{
        timestamps: true,
    }
);


module.exports = model('participante',sedeSchema);