import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { withRouter } from 'react-router-dom';
import BucketPath from './BucketPath';
import BucketSettings from './BucketSettings';
import FileContainer from './FileContainer';
import { Dimmer, Loader } from 'semantic-ui-react';
import { listObjects } from '../utils/amazon-s3-utils';

const BucketViewer = (props) => {
  const [bucket, setBucket] = useState(props.location.state.bucket);
  const [pathInfo, setPathInfo] = useState({ path: '', depth: 0 });
  const [files, setFiles] = useState({ folders: [], files: [] });
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [settings, setSettings] = useState({
    loadMetadata: true,
    loadTags: false,
    loadImages: true
  });

  useEffect(() => {
    if (bucket && loading) {
      updateList();
      setLoading(false);
    }
  });

  useEffect(() => {
    updateList();
  }, [pathInfo]);

  const updatePath = (newPath) => {
    const { history } = props;
    setPathInfo(newPath);
    history.replace(
      {
        pathname: `/bucket-viewer/${bucket.name}/${newPath.path}`
      },
      {
        bucket: bucket
      }
    );
  };

  const updateList = () => {
    setFilesLoading(true);
    listFiles().then(filterList);
  };

  const listFiles = () => {
    return listObjects(bucket, pathInfo.path);
  };

  /**
   * Filters the response into files and folders
   * @param {AWS.S3.ListObjectsV2Output} response
   */
  const filterList = (response) => {
    let depth = pathInfo.depth + 1;
    let newFolders = response.Contents.filter(
      (x) =>
        x.Key.split('/').length === depth + 1 && x.Key[x.Key.length - 1] === '/'
    ).map((folder) => {
      folder.type = 'folder';
      return folder;
    });
    let newFiles = response.Contents.filter(
      (x) =>
        x.Key.split('/').length === depth && x.Key[x.Key.length - 1] !== '/'
    ).map((file) => {
      file.type = 'file';
      return file;
    });
    setFilesLoading(false);
    setFiles({
      folders: newFolders,
      files: newFiles
    });
  };

  if (loading) {
    return (
      <Dimmer>
        <Loader indeterminate>Preparing Files</Loader>
      </Dimmer>
    );
  } else {
    return (
      <div className="bucket-viewer">
        <BucketPath
          bucket={bucket}
          pathInfo={pathInfo}
          pathChange={updatePath}
        />
        <BucketSettings
          bucket={bucket}
          pathInfo={pathInfo}
          settings={settings}
          updateList={updateList}
          settingsChange={setSettings}
        />
        {filesLoading ? (
          <Dimmer>
            <Loader indeterminate>Preparing Files</Loader>
          </Dimmer>
        ) : (
          <FileContainer
            bucket={bucket}
            files={files}
            updateList={updateList}
            pathInfo={pathInfo}
            settings={settings}
            pathChange={updatePath}
          />
        )}
      </div>
    );
  }
};
export default withRouter(BucketViewer);
