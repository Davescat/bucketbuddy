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

export const getObject = async (
  { name, accessKeyId, secretAccessKey, region },
  key
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  });
  try {
    return await s3
      .getObject({
        Bucket: name,
        Key: key
      })
      .promise();
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
export const getObjectURL = async (
  { name, accessKeyId, secretAccessKey, region },
  key
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  });
  try {
    return await s3.getSignedUrlPromise('getObject', {
      Bucket: name,
      Key: key
    });
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
export const listObjects = async (
  { name, accessKeyId, secretAccessKey, region },
  path
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  });
  try {
    return await s3
      .listObjectsV2({
        Bucket: name,
        Prefix: path
      })
      .promise();
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
export const deleteObject = async (
  { name, accessKeyId, secretAccessKey, region },
  key
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  });
  try {
    return await s3
      .deleteObject({
        Bucket: name,
        Key: key
      })
      .promise();
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
export const uploadObject = async ({
  name,
  accessKeyId,
  secretAccessKey,
  region
}) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  });
};
export default testConnectionS3Bucket;
