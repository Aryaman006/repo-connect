const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// No need for config file if using IAM roles for authentication
const config = require("../Config");

// Initialize S3Client without explicit credentials.
// The SDK will automatically look for credentials from:
// 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
// 2. Shared credentials file (~/.aws/credentials)
// 3. IAM Roles (for EC2 instances, Lambda functions, ECS tasks, etc.)
const s3Client = new S3Client({
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  region: config.region,
});

const handleFileUploadToS3 = async (file, fileName, contentType="image/png") => {
  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
      ResponseContentDisposition: 'inline',
    };

    const uploadCommand = new PutObjectCommand(params);
    await s3Client.send(uploadCommand);
    return fileName
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Generates a direct public S3 URL for an object.
 * This assumes the S3 bucket is configured for public read access.
 *
 * @param {string} fileName The key (path/filename) of the object in S3.
 * @returns {string} The direct public S3 URL.
 */
const getImageUrl = (fileName) => {
  const bucketName = process.env.S3_BUCKET_NAME;
  // Get region from the S3 client configuration or environment variable
  const region = config.region; // Access region from the client config
  // Alternatively, use process.env.AWS_REGION if it's consistently set.
  // const region = process.env.AWS_REGION || 'ap-south-1';

  // Standard S3 URL format for public objects:
  // https://<bucket-name>.s3.<region>.amazonaws.com/<key>
  return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
};

const getImageUrl1 = (fileName) => {
  const bucketName = process.env.S3_BUCKET_NAME;
  const region = config.region;

  // IMPORTANT: URL-encode the filename (S3 Key) to handle spaces, colons, etc.
  const encodedFileName = encodeURIComponent(fileName);

  // Standard S3 URL format for public objects:
  // https://<bucket-name>.s3.<region>.amazonaws.com/<encoded-key>
  return `https://${bucketName}.s3.${region}.amazonaws.com/${encodedFileName}`;
};

module.exports = { handleFileUploadToS3, getImageUrl, getImageUrl1 };