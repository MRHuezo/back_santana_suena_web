//Este modelo contiene los mensajes que las sedes le quieran enviar a sus 

const { Schema, model } = require('mongoose');

const comunicadoSchema = new Schema(
    {
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
        },
        mensaje: String
    },{
        timestamps: true,
    }
);


module.exports = model('comunicado', finalistaSchema);