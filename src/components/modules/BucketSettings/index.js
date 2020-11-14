import React, { useState } from 'react';
import { Dropdown, Confirm, Radio } from 'semantic-ui-react';
import FileUploadModule from '../FileUploadModule';
import FolderUploadModule from '../FolderUploadModule';
import SchemaStructureModule from '../SchemaStructureModule';
import { deleteFolder } from '../../utils/amazon-s3-utils';
import './bucket-settings.scss';
import SearchModule from '../SearchModule';

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
  schemaInfo
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteCurrentFolder = () => {
    if (pathInfo.depth >= 1) {
      deleteFolder(bucket, pathInfo.path).then(() => {
        const newPath = {
          path: `${pathInfo.path.split('/', pathInfo.depth - 1).join('/')}/`,
          depth: pathInfo.depth - 1
        };
        pathChange(newPath);
        updateList(newPath);
      });
    }
  };

  const showConfirmDelete = () => {
    setShowConfirm(true);
  };

  const closeConfirmDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bucket-bar">
      <span className="bucket-buttons">
        <Dropdown lazyLoad={true} id="actionDropdown" button text="Actions">
          <Dropdown.Menu>
            <SearchModule
              bucket={bucket}
              trigger={<Dropdown.Item text="Super search" />}
            />
            <FileUploadModule
              updateList={updateList}
              bucket={bucket}
              schemaInfo={schemaInfo}
              pathInfo={pathInfo}
              trigger={<Dropdown.Item text="Upload File" />}
            />
            <FolderUploadModule
              updateList={updateList}
              bucket={bucket}
              pathInfo={pathInfo}
              trigger={<Dropdown.Item text="New Folder" />}
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
              trigger={<Dropdown.Item text="Folder Schema" />}
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
      <span className="bucket-buttons-right"></span>
    </div>
  );
};
export default BucketSettings;
