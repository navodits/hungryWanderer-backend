const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("config");

const s3 = new aws.S3({
<<<<<<< HEAD
  secretAccessKey: config.get("secretAccessKey"),
  accessKeyId: config.get("accessKeyId"),
=======
  secretAccessKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  accessKeyId: "xxxxxxxxxxxxxxxxxxx",
>>>>>>> ddcc58b275f576542f5c4e9fc359cc2ff0b32712
  region: "us-east-1",
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "hungry-wanderer",
    metadata: function (req, file, cb) {
      console.log(file);
      cb(null, { fieldName: file.fieldname });
    },
    Key: function (req, file, cb) {
      console.log(file);
      cb(null, file.fieldname + "_" + Date.now);
    },
  }),
}).array("images", 5);

module.exports = upload;
