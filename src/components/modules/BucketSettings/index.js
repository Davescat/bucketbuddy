import React, { useRef, useState, useEffect } from 'react';
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
  searchModal
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');
  const [currentPathInfo, setCurrentPathInfo] = useState(pathInfo);
  const dropdown = useRef(null);

  useEffect(() => {
    setCurrentPathInfo(pathInfo);
  }, [pathInfo]);

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

  useEffect(() => {
    if (dropdown) {
      dropdown.current.openOnSpace = () => null;
    }
  }, [dropdown]);

  const handleTagChange = (event, { value }) => {
    search.setChosenTag(value);
    setDropdownValue(value);
  };

  const handleFieldChange = (event, { value }) => {
    search.setSearchText(value);
  };

  const showConfirmDelete = () => {
    closeDropdown();
    setShowConfirm(true);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const closeConfirmDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bucket-bar">
      <span className="bucket-buttons">
        <Dropdown
          ref={dropdown}
          onClick={() => setDropdownOpen(true)}
          onClose={() => setDropdownOpen(false)}
          open={dropdownOpen}
          button
          text="Actions"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                closeDropdown();
                searchModal(true);
              }}
              text="Bucket Search"
            />
            <FileUploadModule
              updateList={updateList}
              bucket={bucket}
              schemaInfo={schemaInfo}
              pathInfo={pathInfo}
              trigger={
                <Dropdown.Item onClick={closeDropdown} text="Upload File" />
              }
            />
            <FolderUploadModule
              updateList={updateList}
              bucket={bucket}
              pathInfo={pathInfo}
              trigger={
                <Dropdown.Item onClick={closeDropdown} text="New Folder" />
              }
            />
            {pathInfo.depth >= 1 ? (
              <>
                <Dropdown.Item
                  text="Delete Folder"
                  onClick={showConfirmDelete}
                />
                <Confirm
                  open={showConfirm}
                  cancelButton="Cancel"
                  confirmButton="Delete"
                  onCancel={closeConfirmDelete}
                  onConfirm={deleteCurrentFolder}
                />
              </>
            ) : (
              ''
            )}
            <Dropdown.Divider />
            <SchemaStructureModule
              updateList={updateList}
              schemaInfo={schemaInfo}
              bucket={bucket}
              pathInfo={pathInfo}
              trigger={
                <Dropdown.Item onClick={closeDropdown} text="Folder Schema" />
              }
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
      <span className="bucket-buttons-right">
        <Input
          label={
            schemaInfo.available ? (
              <Dropdown
                options={schemaInfo.tagset.map((tag) => ({
                  text: tag.key,
                  value: tag.key
                }))}
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
