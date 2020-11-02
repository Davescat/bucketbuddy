import React, { useState } from 'react';
import { Dropdown, Confirm, Radio } from 'semantic-ui-react';
import FileUploadModal from '../../modals/file-upload-modal';
import FolderUploadModal from '../../modals/folder-upload-modal';
import SchemaStructureModal from '../../modals/schema-structure-modal';
import { deleteObject, deleteFolder } from '../../utils/amazon-s3-utils';
import './bucketsettings.scss';

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
      let pathValues = pathInfo.path.split('/');
      deleteFolder(bucket, pathInfo.path).then(() => {
        pathChange({
          path: `${pathInfo.path.split('/', pathInfo.depth - 1)}/`,
          depth: pathInfo.depth - 1
        });
        updateList();
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
        <Dropdown button text="Actions">
          <Dropdown.Menu>
            <FileUploadModal
              updateList={updateList}
              bucket={bucket}
              schemaInfo={schemaInfo}
              pathInfo={pathInfo}
              trigger={<Dropdown.Item text="Upload File" />}
            />
            <FolderUploadModal
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
            <SchemaStructureModal
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
