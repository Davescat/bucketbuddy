import AWS from 'aws-sdk';
import {
  NetworkError,
  ForbiddenError,
  GenericS3Error
} from '../errors/s3-errors';

const testConnectionS3Bucket = async ({
  bucketName,
  accessKeyId,
  secretAccessKey,
  region
}) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  });

  try {
    await s3.headBucket({ Bucket: bucketName }).promise();
  } catch (error) {
    if (!error.code) {
      throw new GenericS3Error();
    } else {
      if (error.code === 'Forbidden') {
        throw new ForbiddenError();
      }
      if (error.code === 'NetworkError') {
        throw NetworkError();
      } else {
        throw new GenericS3Error();
      }
    }
  }
};

export default testConnectionS3Bucket;
