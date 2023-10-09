const AWS = require("aws-sdk");

exports.uploadToS3 = async (data, filename) => {
  const bucketName = process.env.BUCKET_NAME;
  const userKey = process.env.IAM_USER_ACCESS_KEY;
  const secretKey = process.env.IAM_USER_SECRET_KEY;

  let s3 = new AWS.S3({
    accessKeyId: userKey,
    secretAccessKey: secretKey,
  });

  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: data,
    ContentType: "text/plain",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result.Location);
      }
    });
  });
};
