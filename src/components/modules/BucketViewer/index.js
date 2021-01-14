import React, { useState, useEffect } from 'react';
import BucketPath from '../BucketPath';
import BucketSettings from '../BucketSettings';
import FileContainer from '../FileContainer';
import { Dimmer, Loader, Transition } from 'semantic-ui-react';
import FolderMenu from '../FolderMenu';
import NavMenu from '../NavMenu';
import SearchModule from '../SearchModule';
import './bucket-viewer.scss';
import {
  listObjects,
  getFolderSchema,
  getObjectTags
} from '../../utils/amazon-s3-utils';

export const schemaFileName = 'bucket-buddy-schema.json';

const BucketViewer = (props) => {
  const [bucket] = useState(props.location.state.bucket);
  const [loading, setLoading] = useState(true);
  const [pathInfo, setPathInfo] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [files, setFiles] = useState({ folders: [], files: [] });
  const [srcArray, setSrcArray] = useState([]);
  const [fileSearchText, setFileSearchText] = useState('');
  const [chosenTag, setChosenTag] = useState('');
  const [tagSearchText, setTagSearchText] = useState('');
  const [filesLoading, setFilesLoading] = useState(true);
  const [schemaInfo, setSchemaInfo] = useState({
    available: false,
    tagset: []
  });
  const [settings, setSettings] = useState({
    cacheImages: localStorage.cacheImages === 'true' ? true : false
  });

  useEffect(() => {
    if (filesLoading && pathInfo) {
      /**
       * Takes a list of files and attaches requested S3 tags to each file
       *
       * @param {S3.GetObjectOutput[]} files
       */
      const getAllTags = (files) => {
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
      };

      /**
       * Filters the response into files and folders and adds the tag
       * information as well as the sources for the images
       *
       * @param {AWS.S3.ListObjectsV2Output} response
       */
      const filterList = async (response, path) => {
        const fileTest = new RegExp(
          `^${path}([À-ÿ\\w!\\-\\.\\*'\\(\\), ]+[/]?)([À-ÿ\\w!\\-\\.\\*'\\(\\), ]+/)?`
        );
        let newFiles = [];
        let newFolders = new Set([]);
        response.Contents.forEach((file) => {
          const filename = fileTest.exec(file.Key);
          if (filename && filename[1]) {
            file.filename = filename[1];
            if (filename[2]) {
              newFolders.add(filename[1]);
            } else if (filename[1][filename[1].length - 1] === '/') {
              newFolders.add(filename[1]);
            } else {
              newFiles.push(file);
            }
          }
        });
        newFolders = [...newFolders].sort();
        sortObjectsAlphabetically(newFiles);

        newFiles = await getAllTags(newFiles);
        return {
          folders: newFolders,
          files: newFiles
        };
      };

      listObjects(bucket, pathInfo.path).then((data) => {
        filterList(data, pathInfo.path).then((files) => {
          setFiles(files);
        });
      });
    }
  }, [filesLoading, bucket, pathInfo]);

  //This checks the url and tries to navigate to the folders directly if refreshed.
  useEffect(() => {
    if (pathInfo) {
      setFilesLoading(true);
    } else {
      const urlPathInfo = window.location.pathname
        .split('/')
        .filter((string) => string !== '');
      if (urlPathInfo.length === 2) {
        setPathInfo({
          path: '',
          depth: 0
        });
      } else {
        let urlInfo = urlPathInfo.slice(
          urlPathInfo.indexOf('bucket-viewer') + 2
        );
        setPathInfo({
          path:
            urlInfo.length > 1
              ? `${urlInfo
                  .map((string) => decodeURIComponent(string))
                  .join('/')}/`
              : `${urlInfo[0]}/`,
          depth: urlInfo.length
        });
      }
    }
  }, [pathInfo]);

  //This will only run once, when bucket, loading, pathInfo all have loaded.
  useEffect(() => {
    if (bucket && loading && pathInfo) {
      updateList(pathInfo);
      setLoading(false);
    }
  }, [bucket, loading, pathInfo]);

  useEffect(() => {
    localStorage.cacheImages = settings.cacheImages;
  }, [settings]);

  //Once files are loaded in loading ends.
  useEffect(() => {
    if (files) {
      setFilesLoading(false);
    }
  }, [files]);

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

  //Triggers the following chain:
  //Path updated and is not null -> files are set to load -> once in loading mode files are fetched -> once files are updated -> file loading becomes false
  const updateList = (path) => {
    if (path === null || path === undefined) {
      setFilesLoading(true);
    } else {
      setPathInfo(path);
    }
  };

  const updatePath = (newPath) => {
    const { history } = props;
    setSrcArray([]);
    setPathInfo(newPath);
    updateList(newPath);
    history.replace(
      {
        pathname: `/bucket-viewer/${encodeURIComponent(bucket.name)}/${
          newPath.path
        }`
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
    const fileIndex = files.files.findIndex((file) => file.Key === key);
    const updatedFile = {
      ...files.files[fileIndex],
      TagSet: tagset
    };
    const filesCopy = [...files.files];
    filesCopy[fileIndex] = updatedFile;
    setFiles({
      folders: files.folders,
      files: filesCopy
    });
  };

  const getFilterFiles = () => {
    const sourceObject = srcArray.reduce((acc, prev) => {
      return Object.assign(acc, prev);
    }, []);
    if (files) {
      return files.files.map((file) => {
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
            searchModal={setSearchModalOpen}
          />
          <BucketSettings
            bucket={bucket}
            pathInfo={pathInfo}
            settings={settings}
            schemaInfo={schemaInfo}
            updateList={updateList}
            setSettings={setSettings}
            pathChange={updatePath}
            searchModal={setSearchModalOpen}
            search={{
              text: tagSearchText,
              setSearchText: setTagSearchText,
              chosenTag: chosenTag,
              setChosenTag: setChosenTag
            }}
          />
          <SearchModule
            bucket={bucket}
            pathChange={updatePath}
            pathInfo={pathInfo}
            modalControl={{ searchModalOpen, setSearchModalOpen }}
          />
        </div>
        <div className="files-folders">
          <FolderMenu
            bucket={bucket}
            isLoading={filesLoading}
            folders={files ? files.folders : []}
            updateList={updateList}
            pathInfo={pathInfo}
            customClickEvent={updatePath}
            search={{
              text: fileSearchText,
              setSearchText: setFileSearchText
            }}
          />
          <div style={{ width: '100%' }}>
            <Transition
              visible={!filesLoading}
              unmountOnHide={true}
              duration={{ show: 230, hide: 160 }}
              children={
                <span>
                  <FileContainer
                    card
                    updateList={updateList}
                    isLoading={filesLoading}
                    bucket={bucket}
                    updateSrcArray={(key, src) => {
                      srcArray.push({ [key]: src, key });
                    }}
                    pathInfo={pathInfo}
                    files={getFilterFiles() || srcArray}
                    updateTagState={updateTagState}
                    schemaInfo={schemaInfo}
                    settings={settings}
                    pathChange={updatePath}
                  />
                </span>
              }
            ></Transition>
          </div>
        </div>
      </div>
    );
  }
};
export default BucketViewer;
