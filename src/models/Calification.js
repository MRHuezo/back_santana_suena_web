const { Schema, model } = require('mongoose');

const calificacionSchema = new Schema(
    {
       
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
        },
        id_competitor:{
            type: Schema.ObjectId,
            ref: 'competitor' 
        },
        id_user:{
            type: Schema.ObjectId,
            ref: 'user' 
        }

    },{
        timestamps: true,
    }
);

module.exports = model('competitor', competitorSchema);