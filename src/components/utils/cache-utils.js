import { getObjectRequest } from './amazon-s3-utils';

export const encode = (data) => {
  if (data.Body.data) {
    var str = data.Body.data.reduce((a, b) => {
      return a + String.fromCharCode(b);
    }, '');
  } else if (data.Body && !data.Body.data) {
    var str = data.Body.reduce((a, b) => {
      return a + String.fromCharCode(b);
    }, '');
  }
  return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
};

/**
 *
 * @param {Request} request
 * @param {String} cacheName
 *
 * @returns {Promise<Response>} data
 */
export const isRequestCached = async (request, cache) => {
  return await cache.match(request);
};

/**
 *
 * @param {import("aws-sdk/clients/s3").ListObjectsV2Output} list Raw ListObjectsV2Output output including files/folders
 * @param {String} cacheName Name of cache needed to be accessed
 * @param {*} pathInfo prop passed on by BucketViewer
 *
 * @returns {import("aws-sdk/clients/s3").ListObjectsV2Output}
 */
export const updateCacheList = async (list, cacheName, pathInfo) => {
  const fileTest = /\.(jpe?g|png|gif|list)$/i;
  const files = list.Contents.filter(
    (file) =>
      file.Key.split('/').length === pathInfo.depth + 1 &&
      fileTest.exec(file.Key)
  );
  return updateCacheFiles(files, cacheName, pathInfo);
};

/**
 * Checks in a list of files which keys need to be updated by looking at the date modified provided by the getobject output.
 * Will return an object containing all the cached reponses and an object with all keys that must be updated.
 *
 * @param {import("aws-sdk/clients/s3").GetObjectOutput[]} files ListObjectsV2Output files only
 * @param {String} cacheName Name of cache needed to be accessed
 * @param {*} pathInfo prop passed on by BucketViewer
 *
 * @returns {*} { neededKeys, cachedKeys }
 */
export const updateCacheFiles = async (files, cacheName, pathInfo) => {
  const requestKeyTest = new RegExp(`^${window.location.origin}/(.*)`);
  const depth = pathInfo.depth + 1;
  const neededKeys = [];
  const cachedKeys = [];

  return caches.open(cacheName).then(async (cache) => {
    const keys = (await cache.keys()).filter((key) => {
      //Adding temporary property for saving regex result
      key.cacheKey = requestKeyTest.exec(key.url)[1];
      return key.cacheKey.split('/').length === depth;
    });
    for (let i = 0; i < files.length; i++) {
      // if (i ===1)
      //If -1 there is a new file found that must be cached
      let cacheIndex = keys.findIndex((key) => key.cacheKey === files[i].Key);
      if (cacheIndex >= 0) {
        let response = await (await cache.match(keys[cacheIndex])).json();
        //If Last modified has changed the file must be updated
        if (files[i].LastModified.toISOString() === response.LastModified) {
          //If found and not modified, can remove request from list,
          response.Key = files[i].Key;
          cachedKeys.push(response);
          keys.splice(cacheIndex, 1);
        } else {
          neededKeys.push(files[i]);
        }
      } else {
        neededKeys.push(files[i]);
      }
    }
    return { neededKeys, cachedKeys };
  });
};

export const getCacheSrc = async (bucket, key, callback) => {
  const extensionCapture = /(?:\.([^.]+))?$/;
  let thing = getObjectRequest(bucket, key);
  const cache = await caches.open(`bucbud${bucket.name}`);
  const cacheInfo = await isRequestCached(`/${key}`, cache);
  if (cacheInfo) {
    const file = await cacheInfo.json();
    callback(file.src);
  } else {
    // alert('saving!')
    thing.send(async (err, data) => {
      const {
        statusCode: status,
        statusMessage: statusText,
        headers: headers
      } = thing.response.httpResponse;
      const header = new Headers(headers);
      const params = {
        status: status,
        statusText: statusText,
        headers: header
      };
      const ext = extensionCapture.exec(key)[1].toLowerCase();
      const encoding = encode(data);
      data.src = `data:image/${ext};base64, ${encoding}`;
      data.Key = key;
      //Deleting the body to not double the amount of data saved, only the src is used.
      delete data.Body;
      let blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      let response = new Response(blob, params);
      await cache.put(`/${key}`, response);
      callback(data.src);
    });
  }
};

export const getCachedSrc = (bucket, key, callback) => {
  caches.open(`bucbud${bucket.name}`).then(async (cache) => {
    const cacheInfo = await isRequestCached(`/${key}`, cache);
    if (cacheInfo) {
      const file = await cacheInfo.json();
      callback(file.src);
    }
  });
};

export const cacheSrc = async (bucket, key, openedCache) => {
  const response = await getObjectRequest(bucket, key).promise();
  const extensionCapture = /(?:\.([^.]+))?$/;
  const {
    statusCode: status,
    statusMessage: statusText,
    headers: headers
  } = response.$response.httpResponse;
  const header = new Headers(headers);
  const params = { status: status, statusText: statusText, headers: header };
  const ext = extensionCapture.exec(key)[1].toLowerCase();
  const encoding = encode(response);
  response.src = `data:image/${ext};base64, ${encoding}`;
  response.key = key;
  delete response.Body;
  let blob = new Blob([JSON.stringify(response, null, 2)], {
    type: 'application/json'
  });
  let cacheResponse = new Response(blob, params);
  if (openedCache) {
    openedCache.put(`/${key}`, cacheResponse);
  } else {
    caches
      .open(`bucbud${bucket.name}`)
      .then((cache) => cache.put(`/${key}`, cacheResponse));
  }
  return response.src;
};
