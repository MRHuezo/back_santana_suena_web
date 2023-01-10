
 const { Schema, model } = require('mongoose');

const finalistaSchema = new Schema(
    {
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
        },
        id_participante:{
            type: Schema.ObjectId,
            ref: 'participante' 
        }
        
    },{
        timestamps: true,
    }
);


module.exports = model('finalista', finalistaSchema);