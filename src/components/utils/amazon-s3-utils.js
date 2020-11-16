import AWS from 'aws-sdk';
import {
  NetworkError,
  ForbiddenError,
  GenericS3Error,
  NoSuchKeyError
} from '../errors/s3-errors';
import { getCacheSrc, getCacheSrc2 } from './cache-utils';

/**
 * Tests connection with an amazon S3 bucket.
 *
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 */
export const testConnectionS3Bucket = async ({
  bucketName,
  accessKeyId,
  secretAccessKey,
  region
}) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
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

/**
 * Gets information and UInt8Array binary data about the S3 object associated with the key.
 *
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 * @param {String} key Key of amazon object
 *
 * @returns {Promise<AWS.S3.GetObjectOutput, AWS.AWSError>} getObjectOutput
 */
export const getObject = (
  { name, accessKeyId, secretAccessKey, region },
  key
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
  });
  try {
    return s3
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

/**
 * Returns a 'thenable' promise that will be resolved with a pre-signed URL for a given operation name.
 *
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 * @param {String} key Key of amazon object
 *
 * @returns {Promise<string>}
 */
export const getObjectURL = (
  { name, accessKeyId, secretAccessKey, region },
  key
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
  });
  try {
    return s3.getSignedUrlPromise('getObject', {
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

/**
 * Returns a string src string for an image tag. If cached is set to true, the cache will be searched and the base64 representation of the image will be returned. If the request has not been cached, the S3 object will be requested, the image base64 encoded, and cached.
 *
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 * @param {String} key Key of amazon object
 * @param {Function} callback
 * @param {boolean} cached If true, will search cache for request and return src.
 *
 * @returns {Promise<String>} Promise<String>
 */
export const getImageSrc = (bucket, key, callback, cached = false) => {
  return cached
    ? getCacheSrc(bucket, key, callback)
    : getObjectURL(bucket, key).then(callback);
};

/**
 * Returns a string src string for an image tag. If cached is set to true, the cache will be searched and the base64 representation of the image will be returned. If the request has not been cached, the S3 object will be requested, the image base64 encoded, and cached.
 *
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 * @param {String} key Key of amazon object
 * @param {Function} callback
 * @param {boolean} cached If true, will search cache for request and return src.
 *
 * @returns {Promise<String>} Promise<String>
 */
export const getImageSrc2 = (bucket, key, cached = false) => {
  return cached ? getCacheSrc2(bucket, key) : getObjectURL(bucket, key);
};

/**
 * Lists objects inside of an S3 bucket with the path supplied
 *
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 * @param {String} path prefix to keys returned
 *
 * @returns {Promise<AWS.S3.ListObjectsV2Output, AWS.AWSError>}
 */
export const listObjects = (
  { name, accessKeyId, secretAccessKey, region },
  path
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
  });
  try {
    return s3
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

/**
 *
 * @param {*} bucket
 * @param {AWS.S3.ObjectList} imgList
 */
export const getSrcList = (
  { name, accessKeyId, secretAccessKey, region },
  imgList
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
  });
  try {
    const fileTest = /\.(jpe?g|png|gif|bmp)$/i;
    return Promise.all(
      imgList.map(async (img) => {
        if (fileTest.test(img.Key)) {
          let src = await s3.getSignedUrlPromise('getObject', {
            Bucket: name,
            Key: img.Key
          });
          return { ...img, src: src };
        } else {
          return img;
        }
      })
    );
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
 * Deletes an object inside of the S3 bucket with the key supplied.
 *
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 * @param {String} key Key of amazon object
 */
export const deleteObject = (
  { name, accessKeyId, secretAccessKey, region },
  key
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
  });
  try {
    return s3
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

export const deleteFolder = async (
  { name, accessKeyId, secretAccessKey, region },
  key
) => {
  try {
    const contents = await listObjects(
      { name, accessKeyId, secretAccessKey, region },
      key
    );
    const toDelete = contents.Contents.map((object) => ({ Key: object.Key }));
    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
      signatureVersion: 'v4'
    });
    return s3
      .deleteObjects({
        Bucket: name,
        Delete: { Objects: toDelete }
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
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 * @param {String} path the folder where the file will be placed
 * @param {any} file file from a file input.
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
      region,
      signatureVersion: 'v4'
    });
    const params = {
      Bucket: name,
      Key: `${path}${file.name}`,
      Body: file,
      Tagging: tags ? tags : ''
    };
    return s3.upload(params).promise();
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
    region,
    signatureVersion: 'v4'
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
    region,
    signatureVersion: 'v4'
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
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
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

/**
 * Lists objects inside of an S3 bucket with the path supplied
 *
 * @param {{bucketName,accessKeyId,secretAccessKey,region}} bucketInfo Bucket information containing bucket name, access key, secret access key, and region.
 * @param {String} path prefix to keys returned
 *
 * @returns {Promise<AWS.S3.ListObjectsV2Output, AWS.AWSError>}
 */
export const listAllObjects = (
  { name, accessKeyId, secretAccessKey, region },
  path
) => {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
  });
  try {
    const recursive = async (s3, name, array = [], path = '', token = null) => {
      const data = await search(s3, name, path, token);
      if (data.NextContinuationToken) {
        array.push(...data.Contents);
        return await recursive(
          s3,
          name,
          array,
          path,
          data.NextContinuationToken
        );
      } else {
        array.push(...data.Contents);
        return array;
      }
    };
    return recursive(s3, name);
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
 * @param {AWS.S3} s3Instance
 * @param {*} path
 * @param {*} token
 */
const search = (s3Instance, name, path, token = null) => {
  return s3Instance
    .listObjectsV2({
      Bucket: name,
      Prefix: path,
      MaxKeys: 500,
      ContinuationToken: token
    })
    .promise();
};

export default testConnectionS3Bucket;
