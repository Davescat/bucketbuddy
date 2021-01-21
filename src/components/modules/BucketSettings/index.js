import React, { useState, useEffect } from 'react';
import { Dropdown, Confirm, Radio, Input } from 'semantic-ui-react';
import FileUploadModule from '../FileUploadModule';
import FolderUploadModule from '../FolderUploadModule';
import SchemaStructureModule from '../SchemaStructureModule';
import { deleteFolder } from '../../utils/amazon-s3-utils';
import './bucket-settings.scss';

/**
 * This component controls how much info you want to load in from the api
 */
const BucketSettings = ({
  settings,
  setSettings,
  pathChange,
  updateList,
  bucket,
  pathInfo,
  search,
  schemaInfo,
  searchModal,
  searchTags
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');
  const [currentPathInfo, setCurrentPathInfo] = useState(pathInfo);
  const [searchableTags, setSearchableTags] = useState([]);
  const [modalsControl, setModalsControl] = useState({
    folderUpload: false,
    fileUpload: false,
    schemaModal: false
  });

  useEffect(() => {
    setCurrentPathInfo(pathInfo);
  }, [pathInfo]);

  useEffect(() => {
    searchableTags.splice(0, searchableTags.length);
    const sct = schemaInfo.tagset.map((tag) => tag.key);
    const set = [...searchTags];
    const newtags = new Set([...sct, ...set]);
    setSearchableTags(
      [...newtags].map((tags) => ({
        text: tags,
        value: tags
      }))
    );
  }, [searchTags, schemaInfo]);

  useEffect(() => {
    if (currentPathInfo.path !== pathInfo.path) {
      setDropdownValue('');
      search.setSearchText('');
    }
  }, [schemaInfo, search, pathInfo, currentPathInfo]);

  const deleteCurrentFolder = () => {
    if (pathInfo.depth >= 1) {
      deleteFolder(bucket, pathInfo.path).then(() => {
        const newdepth = pathInfo.depth - 1;
        const newPath = {
          path: `${pathInfo.path.split('/', newdepth).join('/')}${
            newdepth === 0 ? '' : '/'
          }`,
          depth: newdepth
        };
        pathChange(newPath);
        updateList(newPath);
      });
    }
  };

  const handleTagChange = (event, { value }) => {
    search.setChosenTag(value);
    setDropdownValue(value);
  };

  const handleFieldChange = (event, { value }) => {
    search.setSearchText(value);
  };

  const showConfirmDelete = () => {
    setShowConfirm(true);
  };

  const closeConfirmDelete = () => {
    setShowConfirm(false);
  };

  const openModal = (name) => {
    setModalsControl({ ...modalsControl, [name]: true });
  };
  const closeModal = (name) => {
    setModalsControl({ ...modalsControl, [name]: false });
  };

  return (
    <div className="bucket-bar">
      <span className="bucket-buttons">
        <Dropdown button text="Actions">
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => searchModal(true)}
              text="Bucket Search"
            />
            <Dropdown.Item
              onClick={() => openModal('fileUpload')}
              text="Upload File"
            />
            <Dropdown.Item
              onClick={() => openModal('folderUpload')}
              text="New Folder"
            />
            {pathInfo.depth >= 1 && (
              <Dropdown.Item text="Delete Folder" onClick={showConfirmDelete} />
            )}
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => openModal('schemaModal')}
              text="Folder Schema"
            />
          </Dropdown.Menu>
        </Dropdown>
        <Radio
          toggle
          name="loadTags"
          checked={settings.cacheImages}
          label="Cache Images"
          onChange={() =>
            setSettings({
              ...settings,
              cacheImages: !settings.cacheImages
            })
          }
        />
      </span>
      <>
        <FileUploadModule
          updateList={updateList}
          bucket={bucket}
          schemaInfo={schemaInfo}
          pathInfo={pathInfo}
          control={{
            close: () => closeModal('fileUpload'),
            status: modalsControl.fileUpload
          }}
        />
        <FolderUploadModule
          updateList={updateList}
          bucket={bucket}
          pathInfo={pathInfo}
          control={{
            close: () => closeModal('folderUpload'),
            status: modalsControl.folderUpload
          }}
        />
        <SchemaStructureModule
          updateList={updateList}
          schemaInfo={schemaInfo}
          bucket={bucket}
          pathInfo={pathInfo}
          control={{
            close: () => closeModal('schemaModal'),
            status: modalsControl.schemaModal
          }}
        />
      </>
      <Confirm
        open={showConfirm}
        cancelButton="Cancel"
        confirmButton="Delete"
        onCancel={closeConfirmDelete}
        onConfirm={deleteCurrentFolder}
      />
      <span className="bucket-buttons-right">
        <Input
          label={
            schemaInfo.available || searchTags?.size > 0 ? (
              <Dropdown
                options={searchableTags}
                onChange={handleTagChange}
                selectOnBlur={false}
                value={dropdownValue}
                placeholder="Filename"
                clearable
              />
            ) : (
              'Filename'
            )
          }
          value={search.text}
          labelPosition="right"
          onChange={handleFieldChange}
          placeholder="Tag Search"
        />
      </span>
    </div>
  );
};
export default BucketSettings;
