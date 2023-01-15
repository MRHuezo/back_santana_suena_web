
const { Schema, model } = require('mongoose');

const comunicadoSchema = new Schema(
    {
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
        },
        key_image: String
    },{
        timestamps: true,
    }
);
