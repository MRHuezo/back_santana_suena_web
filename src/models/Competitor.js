const { Schema, model } = require('mongoose');

const competitorSchema = new Schema(
    {
        name: String,
        id_sede:{
            type: Schema.ObjectId,
            ref: 'sede' 
        },
        address: String,
        email:{
            type: String,
            unique: true,
            trim: true,
        },
        url_video:String,
        pay: String,
        personal_identify: String,
        phone: String,
        name_song: String,
        artistic_experience: String,
        from: String,
        birthday: String,
        genre: String,
        status: String

    },{
        timestamps: true,
    }
);

module.exports = model('competitor', competitorSchema);
