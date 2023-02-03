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
        pay_key:String,
        personal_identify: String,
        personal_identify_key: String,
        photo: String,
        photo_key: String,
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
