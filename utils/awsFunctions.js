const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');
const path = require('path');
const bucketName = process.env.AWS_BUCKET_NAME;

const s3Config = new aws.S3({
    accessKeyId: process.env.AWS_IAM_USER_KEY,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET,
    bucket: bucketName,
});

const fundImgS3Config = multerS3({
    s3: s3Config,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, "fundImages/"+ file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname))
    }
});

const fundDocsS3Config = multerS3({
    s3: s3Config,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, "funDocuments/" + file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname))
    }
});

exports.uploadFundImages = multer({
    storage: fundImgS3Config,
    limits: {
        fileSize: 1024 * 1024 * 10   //10 mb
    }
});

exports.uploadFundDocuments = multer({
    storage: fundDocsS3Config,
    limits: {
        fileSize: 1024 * 1024 * 10   //10 mb
    }
});

exports.deleteFile = async (fileuri) => {
    const fileKey = fileuri.split('/').slice(-2).join("/");
    return await s3Config.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey
    }).promise();
}