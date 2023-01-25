const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema(
    {
        email: String,
        password: {
            type: String,
            require: true,
            trim: true
        },
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
        },
        rol: String
      
      
    },{
        timestamps: true,
    }
);


module.exports = model('usuario',usuarioSchema);