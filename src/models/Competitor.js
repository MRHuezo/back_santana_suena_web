const { Schema, model } = require('mongoose');

const competitorSchema = new Schema(
    {
        name: String,
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
        },
        address: String,
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
        genero: String,
        aviso_privacidad: Boolean
    },{
        timestamps: true,
    }
);

module.exports = model('competitor', competitorSchema);
