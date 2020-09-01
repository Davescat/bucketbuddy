import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import BucketPath from './BucketPath';
import BucketSettings from './BucketSettings';
import FileContainer from './FileContainer';
import { Dimmer, Loader, Transition, Button } from 'semantic-ui-react';
import { listObjects, getFolderSchema } from '../utils/amazon-s3-utils';
import FolderMenu from './FolderMenu';
import NavMenu from '../modules/NavMenu';

export const schemaFileName = 'bucket-buddy-schema.json';

const BucketViewer = (props) => {
  const [bucket] = useState(props.location.state.bucket);
  const [pathInfo, setPathInfo] = useState(null);
  const [files, setFiles] = useState({ folders: [], files: [] });
  const [visibleFiles, setVisibleFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [transitions, setTransitions] = useState(['fly right', 'fly left']);
  const [schemaInfo, setSchemaInfo] = useState({
    available: false,
    tagset: []
  });
  const [filesLoading, setFilesLoading] = useState(true);
  const [settings, setSettings] = useState({
    loadMetadata: true,
    loadTags: false,
    loadImages: true
  });

  //This checks the url and tries to navigate to the folders directly if refreshed
  if (!pathInfo) {
    const urlPathInfo = props.location.pathname.split('/');
    if (urlPathInfo.length === 2) {
      setPathInfo({
        path: '',
        depth: 0
      });
    } else {
      setPathInfo({
        path: urlPathInfo.slice(urlPathInfo.indexOf(bucket.name) + 1).join('/'),
        depth:
          urlPathInfo.slice(urlPathInfo.indexOf(bucket.name) + 1).length - 1
      });
    }
  }

  useEffect(() => {
    if (bucket && loading) {
      updateList();
      setLoading(false);
    }
  });

  useEffect(() => {
    updateList();
  }, [pathInfo]);

  useEffect(() => {
    if (
      files.files.some(
        ({ Key }) => Key.split('/')[pathInfo.depth] === schemaFileName
      )
    ) {
      getFolderSchema(bucket, pathInfo.path).then((response) =>
        setSchemaInfo({ available: true, tagset: response })
      );
    } else {
      setSchemaInfo({ available: false, tagset: [] });
    }
  }, [files]);

  const updatePath = (newPath) => {
    if (newPath.depth > pathInfo.depth) {
      setTransitions(['fly right', 'fly left']);
    } else {
      setTransitions(['fly left', 'fly right']);
    }
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

  const sortObjectsAlphabetically = (objects) => {
    objects.sort(function (fileOne, fileTwo) {
      return fileOne.Key.toLowerCase() < fileTwo.Key.toLowerCase()
        ? -1
        : fileOne.Key.toLowerCase() > fileTwo.Key.toLowerCase()
        ? 1
        : 0;
    });
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

    sortObjectsAlphabetically(newFiles);
    sortObjectsAlphabetically(newFolders);

    setFilesLoading(false);
    if (visibleFiles) {
      setVisibleFiles({
        folders: newFolders,
        files: newFiles
      });
    } else {
      setVisibleFiles({
        folders: newFolders,
        files: newFiles
      });
      setFiles({
        folders: newFolders,
        files: newFiles
      });
    }
  };

  const transition = () => {
    visibleFiles ? setFiles(visibleFiles) : setVisibleFiles(null);
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
        <NavMenu />
        <BucketPath
          bucket={bucket}
          pathInfo={pathInfo}
          pathChange={updatePath}
          updateList={updateList}
        />
        <BucketSettings
          bucket={bucket}
          pathInfo={pathInfo}
          settings={settings}
          schemaInfo={schemaInfo}
          updateList={updateList}
          settingsChange={setSettings}
          pathChange={updatePath}
        />
        <div className="files-folders">
          <FolderMenu
            bucket={bucket}
            folders={files.folders.map((x) => {
              const keys = x.Key.split('/');
              const filename =
                keys.length === 1 ? keys[0] : keys[keys.length - 2] + '/';
              return {
                ...x,
                filename: filename
              };
            })}
            updateList={updateList}
            pathInfo={pathInfo}
            customClickEvent={updatePath}
            search={{ text: searchText, setSearchText: setSearchText }}
          />
          <div>
            <Transition
              visible={!filesLoading}
              onStart={() => transition()}
              onComplete={() => transitions.reverse()}
              onShow={() => {
                if (!filesLoading && files !== visibleFiles) {
                  setFiles(visibleFiles);
                }
              }}
              unmountOnHide
              animation={transitions[0]}
              duration={250}
            >
              <span>
                {files.folders.length === 0 &&
                files.files.length === 0 &&
                filesLoading ? (
                  <Dimmer active>
                    <Loader indeterminate>Preparing Files</Loader>
                  </Dimmer>
                ) : (
                  <FileContainer
                    card
                    isLoading={filesLoading}
                    bucket={bucket}
                    files={files}
                    schemaInfo={schemaInfo}
                    settings={settings}
                    pathChange={updatePath}
                  />
                )}
              </span>
            </Transition>
          </div>
        </div>
      </div>
    );
  }
};
export default withRouter(BucketViewer);
