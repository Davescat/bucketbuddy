import AWS from 'aws-sdk';
import {
  NetworkError,
  ForbiddenError,
  GenericS3Error,
  NoSuchKeyError
} from '../errors/s3-errors';

export const testConnectionS3Bucket = async ({
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
    console.log(error);
    if (!error.code) {
      throw new GenericS3Error();
    } else {
      if (error.code === 'Forbidden') {
        throw new ForbiddenError();
      }
      if (error.code === 'NoSuchKey') {
        throw new NoSuchKeyError();
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

/**
 *
 * @param {*} BucketData
 * @param {*} path
 * @param {*} file
 * @param {*} tags in URL encoded format ex: Key1=Val1&Key2=Val2
 */
export const uploadObject = async (
  { name, accessKeyId, secretAccessKey, region },
  path,
  file,
  tags
) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region
    });
    var params = {
      Bucket: name,
      Key: `${path}${file.name}`,
      Body: file,
      Tagging: tags ? tags : ''
    };
    s3.upload(params).promise();
  } catch (error) {
    console.log(error);
    if (!error.code) {
      throw new GenericS3Error();
    } else {
      if (error.code === 'Forbidden') {
        throw new ForbiddenError();
      }
      if (error.code === 'NoSuchKey') {
        throw new NoSuchKeyError();
      }
      if (error.code === 'NetworkError') {
        throw NetworkError();
      } else {
        throw new GenericS3Error();
      }
    }
  }
};

export const getFolderSchema = async (
  { name, accessKeyId, secretAccessKey, region },
  folderKey
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
        Key: `${folderKey}bucket-buddy-schema.json`
      })
      .promise()
      .then((x) => JSON.parse(x.Body));
  } catch (error) {
    console.log(error);
    if (!error.code) {
      throw new GenericS3Error();
    } else {
      if (error.code === 'Forbidden') {
        throw new ForbiddenError();
      }
      if (error.code === 'NoSuchKey') {
        throw new NoSuchKeyError();
      }
      if (error.code === 'NetworkError') {
        throw NetworkError();
      } else {
        throw new GenericS3Error();
      }
    }
  }
};

export const getObjectTags = async (
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
      .getObjectTagging({
        Bucket: name,
        Key: key
      })
      .promise();
  } catch (error) {
    console.log(error);
    if (!error.code) {
      throw new GenericS3Error();
    } else {
      if (error.code === 'Forbidden') {
        throw new ForbiddenError();
      }
      if (error.code === 'NoSuchKey') {
        throw new NoSuchKeyError();
      }
      if (error.code === 'NetworkError') {
        throw NetworkError();
      } else {
        throw new GenericS3Error();
      }
    }
  }
};

export const putObjectTags = async (
  { name, accessKeyId, secretAccessKey, region },
  key,
  tagset
) => {
  console.log(key);
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  });
  try {
    return await s3
      .putObjectTagging({
        Bucket: name,
        Key: key,
        Tagging: tagset
      })
      .promise();
  } catch (error) {
    console.log(error);
    if (!error.code) {
      throw new GenericS3Error();
    } else {
      if (error.code === 'Forbidden') {
        throw new ForbiddenError();
      }
      if (error.code === 'NoSuchKey') {
        throw new NoSuchKeyError();
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
