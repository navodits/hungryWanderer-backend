const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  secretAccessKey: "5Qaaz9lHbzX6xpfSz7IUlUCMWEUFfRvsPmal82GP",
  accessKeyId: "AKIAJF2G3CKLNMDKKYDA",
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
