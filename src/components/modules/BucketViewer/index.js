import React, { useState, useEffect, useCallback } from 'react';
import BucketPath from '../BucketPath';
import BucketSettings from '../BucketSettings';
import FileContainer from '../FileContainer';
import { Dimmer, Loader, Transition } from 'semantic-ui-react';
import {
  listObjects,
  getFolderSchema,
  getObjectTags
} from '../../utils/amazon-s3-utils';
import FolderMenu from '../FolderMenu';
import NavMenu from '../NavMenu';
import './bucket-viewer.scss';

export const schemaFileName = 'bucket-buddy-schema.json';

const BucketViewer = (props) => {
  const [bucket] = useState(props.location.state.bucket);
  const [pathInfo, setPathInfo] = useState(null);
  const [files, setFiles] = useState({ folders: [], files: [] });
  const [visibleFiles, setVisibleFiles] = useState(null);
  const [srcArray, setSrcArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileSearchText, setFileSearchText] = useState('');
  const [chosenTag, setChosenTag] = useState('');
  const [tagSearchText, setTagSearchText] = useState('');
  const [transitions, setTransitions] = useState(['fly right', 'fly left']);
  const [filesLoading, setFilesLoading] = useState(true);
  const [schemaInfo, setSchemaInfo] = useState({
    available: false,
    tagset: []
  });
  const [settings, setSettings] = useState({
    cacheImages: localStorage.cacheImages === 'true' ? true : false
  });

  /**
   * Takes a list of files and attaches requested S3 tags to each file
   *
   * @param {S3.GetObjectOutput[]} files
   */
  const getAllTags = useCallback(
    (files) => {
      return Promise.all(
        files.map(async function (file) {
          return await getObjectTags(bucket, file.Key).then((TagSet) => ({
            ...file,
            TagSet: TagSet.TagSet.map(({ Key, Value }) => ({
              key: Key,
              value: Value
            }))
          }));
        })
      );
    },
    [bucket]
  );

  /**
   * Filters the response into files and folders and adds the tag
   * information as well as the sources for the images
   *
   * @param {AWS.S3.ListObjectsV2Output} response
   */
  const filterList = useCallback(
    async (response) => {
      const filetest = new RegExp(
        `^${pathInfo.path}([\\w!\\-\\.\\*'\\(\\), ]+[/]?)$`
      );
      let newFiles = [];
      const newFolders = [];
      response.Contents.forEach((file) => {
        const filename = filetest.exec(file.Key);
        if (filename && filename[1]) {
          file.filename = filename[1];
          if (filename[1][filename[1].length - 1] === '/') {
            newFolders.push(file);
          } else {
            newFiles.push(file);
          }
        }
      });
      sortObjectsAlphabetically(newFiles);
      sortObjectsAlphabetically(newFolders);

      newFiles = await getAllTags(newFiles);
      const currentFiles = {
        folders: newFolders,
        files: newFiles
      };
      if (visibleFiles) {
        setVisibleFiles(currentFiles);
      } else {
        setVisibleFiles(currentFiles);
        setFiles(currentFiles);
      }
    },
    [getAllTags, pathInfo, visibleFiles]
  );

  const updateList = useCallback(() => {
    setFilesLoading(true);
    listObjects(bucket, pathInfo.path).then((data) => {
      filterList(data);
    });
  }, [bucket, filterList, pathInfo]);

  //This checks the url and tries to navigate to the folders directly if refreshed. Will only run once.
  useEffect(() => {
    const urlPathInfo = props.location.pathname.split('/');
    if (urlPathInfo.length === 2) {
      setPathInfo({
        path: '',
        depth: 0
      });
    } else {
      let urlInfo = urlPathInfo.slice(urlPathInfo.indexOf(bucket.name) + 1);
      setPathInfo({
        path: urlInfo.join('/'),
        depth: urlInfo.length - 1
      });
    }
  }, [bucket.name, props.location.pathname]);

  useEffect(() => {
    if (bucket && loading && pathInfo) {
      updateList();
      setLoading(false);
    }
  }, [bucket, loading, pathInfo, updateList]);

  useEffect(() => {
    localStorage.cacheImages = settings.cacheImages;
  }, [settings]);

  useEffect(() => {
    if (!loading) {
      updateList();
    }
  }, [pathInfo, loading, updateList]);

  useEffect(() => {
    setFilesLoading(false);
  }, [visibleFiles]);

  useEffect(() => {
    if (
      files.files.some(
        ({ Key }) => Key.split('/')[pathInfo.depth] === schemaFileName
      )
    ) {
      getFolderSchema(bucket, pathInfo.path).then((response) => {
        setSchemaInfo({ available: true, tagset: response });
      });
    } else {
      setSchemaInfo({ available: false, tagset: [] });
    }
  }, [files, bucket, pathInfo]);

  const updatePath = (newPath) => {
    if (newPath.depth > pathInfo.depth) {
      setTransitions(['fly right', 'fly left']);
    } else {
      setTransitions(['fly left', 'fly right']);
    }
    const { history } = props;
    setSrcArray([]);
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

  const sortObjectsAlphabetically = (objects) => {
    objects.sort(function (fileOne, fileTwo) {
      return fileOne.Key.toLowerCase() < fileTwo.Key.toLowerCase()
        ? -1
        : fileOne.Key.toLowerCase() > fileTwo.Key.toLowerCase()
        ? 1
        : 0;
    });
    const schemaIndex = objects.findIndex(
      (file) => file.filename === schemaFileName
    );
    if (schemaIndex !== -1) {
      const temp = objects[0];
      objects[0] = objects[schemaIndex];
      objects[schemaIndex] = temp;
    }
  };

  const updateTagState = (key, tagset) => {
    console.log(key, tagset);
    const fileIndex = visibleFiles.files.findIndex((file) => file.Key === key);
    const updatedFile = {
      ...visibleFiles.files[fileIndex],
      TagSet: tagset
    };
    const filesCopy = [...visibleFiles.files];
    filesCopy[fileIndex] = updatedFile;
    setVisibleFiles({
      folders: visibleFiles.folders,
      files: filesCopy
    });
  };

  const transition = () => {
    visibleFiles ? setFiles(visibleFiles) : setVisibleFiles(null);
  };

  const getFilterFiles = () => {
    const sourceObject = srcArray.reduce((acc, prev) => {
      return Object.assign(acc, prev);
    }, []);
    if (visibleFiles) {
      return visibleFiles.files.map((file) => {
        let isHidden = false;
        if (chosenTag === '') {
          if (tagSearchText === '') {
            isHidden = false;
          } else {
            isHidden = file.filename
              .toLowerCase()
              .search(tagSearchText.toLowerCase());
          }
        } else {
          //This filter checks if there are any files with the tag that is used to search
          const tagFile = file.TagSet.filter((x) => x['key'] === chosenTag);
          //If a file has the Tag chosen for searching. If length doesn't exist or is 0 it will be false
          if (tagFile.length && tagFile.length > 0) {
            //If no tag search text has been written just show all files with tag chosen
            if (tagSearchText === '') {
              isHidden = false;
            } else {
              isHidden = !(
                tagFile[0]['value']
                  .toLowerCase()
                  .search(tagSearchText.toLowerCase()) !== -1
              );
            }
          } else {
            isHidden = true;
          }
        }
        return { ...file, hidden: isHidden, src: sourceObject[file.Key] };
      });
    }
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
        <div className="bucket-info">
          <NavMenu />
          <BucketPath
            bucket={bucket}
            pathInfo={pathInfo}
            schemaInfo={schemaInfo}
            pathChange={updatePath}
            updateList={updateList}
            search={{
              text: tagSearchText,
              setSearchText: setTagSearchText,
              chosenTag: chosenTag,
              setChosenTag: setChosenTag
            }}
          />
          <BucketSettings
            bucket={bucket}
            pathInfo={pathInfo}
            settings={settings}
            schemaInfo={schemaInfo}
            updateList={updateList}
            setSettings={setSettings}
            pathChange={updatePath}
          />
        </div>
        <div className="files-folders">
          <FolderMenu
            bucket={bucket}
            isLoading={filesLoading}
            folders={files.folders}
            updateList={updateList}
            pathInfo={pathInfo}
            customClickEvent={updatePath}
            search={{ text: fileSearchText, setSearchText: setFileSearchText }}
          />
          <div style={{ width: '100%' }}>
            <Transition
              visible={!filesLoading}
              onStart={() => transition()}
              onComplete={() => transitions.reverse()}
              onShow={() =>
                !filesLoading &&
                files !== visibleFiles &&
                setFiles(visibleFiles)
              }
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
                    updateList={updateList}
                    isLoading={filesLoading}
                    bucket={bucket}
                    updateSrcArray={(key, src) => {
                      srcArray.push({ [key]: src, key });
                    }}
                    files={getFilterFiles() || srcArray}
                    updateTagState={updateTagState}
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
export default BucketViewer;
