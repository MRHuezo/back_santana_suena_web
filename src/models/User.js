const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        email: String,
        user:String,
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


module.exports = model('user',userSchema);