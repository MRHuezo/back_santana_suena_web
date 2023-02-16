const subir = {};
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

//Filtros que se aceptaran en los archivos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    return cb(new Error("Formato no valido"));
  }
};

//Aqui es donde conectamos al Bucket de Amazon S3 y le damos los filtros
const configuracionMulter = {
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.NAME_BUCKET_AMS,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "Testing_metadata" });
    },
    key: function (req, file, cb) {
     
      const type = file.originalname.split(".");
      cb(null, file.fieldname + "-" + Date.now().toString() + `.${type[1]}`);
    },
  }),
};

const configuracionMulterInFilter = {
  storage: multerS3({
    s3: s3,
    bucket: process.env.NAME_BUCKET_AMS,
    acl: "public-read",
    metadata: function (req, file, cb) {
      console.log("metadata", file);
      cb(null, { fieldName: "Testing_metadata" });
    },
    key: function (req, file, cb) {
      console.log("key", file);
      const type = file.originalname.split(".");
      cb(null, Date.now().toString() + `.${type[1]}`);
    },
  }),
};

//Funcion que elimina la imagen deL Bucket
subir.eliminarImagen = (keyDeleted) => {
  s3.deleteObject(
    {
      Bucket: process.env.NAME_BUCKET_AMS,
      Key: keyDeleted,
    },
    function (err, data) {
      if (err) {
        throw err;
      }
    }
  );
};

subir.upload = multer(configuracionMulter).single("imagen");

subir.uploadInscription = multer(configuracionMulter).fields([
  { name: "photo", maxCount: 1 },
  { name: "pay", maxCount: 1 },
  { name: "personal_identify", maxCount: 1 },
]);

subir.uploadFile = multer(configuracionMulterInFilter).single("file");

module.exports = subir;
