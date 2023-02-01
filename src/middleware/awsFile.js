require("dotenv").config({path: ".env"});
/* require('dotenv').config({silent: true}) */
const AWS = require("aws-sdk");

//const ID = process.env.AWS_ACCESS_ID;
//const SECRET = process.env.AWS_SECRET_ACCESS;
//const BUCKET = process.env.AWS_BUCKET_NAME;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

/* const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,

}) */

async function awsUploadImage(file, folder) {
    try {
        let params = { 
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: "",
            Body: file
        }

        const { createReadStream, filename, mimetype } = await file;
        // Invoking the `createReadStream` will return a Readable Stream.
        // See https://nodejs.org/api/stream.html#stream_readable_streams
        const stream = createReadStream();

        stream.on("error", (error) => console.error(error));
        params.Body = stream;
        let timestamp = new Date().getTime();
        const round_num = Math.floor((Math.random() * 5) + 1);
        // get the file extension.
        const file_extension = mimetype.split('/')[1];
        const final_key = `${timestamp}${round_num}`;
        params.Key = `${folder}/${final_key}.${file_extension}`;
        // upload the object.
        const result = await s3.upload(params).promise();

        /* const params = { 
            Bucket: BUCKET,
            Key: `${filepath}`,
            Body: file
        } */

        //const response = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        console.log(error);
        throw new Error();
    }
}
async function awsUploadImageMultiple(files,folder){
    // create an object containing the name of the bucket, the key, body, and acl of the object.
    let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "",
        Body: files
    };

    let folder_location = [
        "productos",
        "empresas",
        "usuarios"
    ];

    // structure the return data.
    let objects = [];

    // loop through all the sent files.
    for(let i = 0; i < files.length; i++){
        let file = files[i];
        // From the file, get the read stream and the filename.
        let {createReadStream, filename , mimetype} = await file;
        // read the data from the file.
        let stream = createReadStream();
        // in case of any error, log it.
        stream.on("error", (error) => console.error(error));
        // assign the body of the object to the data to read.
        params.Body = stream;
        // get the current timestamp.
        let timestamp = new Date().getTime();
        const round_num = Math.floor((Math.random() * 5) + 1);
        // get the file extension.
        const file_extension = mimetype.split('/')[1];
        const final_key = `${timestamp}${round_num}`;
        // compose the key as the folder name, the timestamp, and the file extension of the object.
        params.Key = `${folder_location[folder]}/${final_key}.${file_extension}`;
        // upload the object.
        const result = await s3.upload(params).promise();
        // push the structured response to the objects array.
        objects.push({
            url_imagen: result.Location,
            location_imagen: params.Key,
            key_imagen: final_key,
            extencion_imagen: file_extension
        });
    };
    // return the response to the client.
    return objects;

};
 
const eliminarImagenesAWS = async (files) => {
    for(var i=0; i < files.length; i++){
        const img = files[i];
        s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: img.key_imagen,
        },function(err, data) {
            if(err){
                throw err;
            } 
        })
    }
}

 const eliminarUnaImagen = async (keyDeleted) => {
     s3.deleteObject({
       Bucket: process.env.AWS_BUCKET_NAME,
       Key: keyDeleted
     },function(err, data) {
       if(err){
         throw err;
       } 
     })
   }

module.exports = { awsUploadImage, awsUploadImageMultiple, eliminarImagenesAWS, eliminarUnaImagen };