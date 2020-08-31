import React from 'react';
import { Button } from 'semantic-ui-react';
import FileUploadModal from '../modals/file-upload-modal';
import FolderUploadModal from '../modals/folder-upload-modal';
import SchemaStructureModal from '../modals/schema-structure-modal';
import { deleteObject } from '../utils/amazon-s3-utils';

/**
 * This component controls how much info you want to load in from the api
 */
const BucketSettings = ({
  pathChange,
  updateList,
  bucket,
  pathInfo,
  schemaInfo
}) => {
  const deleteCurrentFolder = () => {
    if (pathInfo.depth >= 1) {
      let pathValues = pathInfo.path.split('/');

      deleteObject(bucket, pathInfo.path).then(() => {
        pathChange({
          path: `${pathInfo.path.split('/', pathInfo.depth - 1)}/`,
          depth: pathValues.depth
        });
        updateList();
      });
    }
  };

  return (
    <div className="bucket-bar">
      <span className="bucket-buttons">
        <FolderUploadModal
          updateList={updateList}
          bucket={bucket}
          pathInfo={pathInfo}
          trigger={<Button size="medium">New Folder</Button>}
        />
        <FileUploadModal
          updateList={updateList}
          bucket={bucket}
          schemaInfo={schemaInfo}
          pathInfo={pathInfo}
          trigger={<Button size="medium">Upload</Button>}
        />
        <SchemaStructureModal
          updateList={updateList}
          schemaInfo={schemaInfo}
          bucket={bucket}
          pathInfo={pathInfo}
          trigger={<Button size="medium">Tags in folder Schema</Button>}
        />
      </span>
      <span className="bucket-buttons-right">
        {pathInfo.depth >= 1 ? (
          <Button size="medium" color="red" onClick={deleteCurrentFolder}>
            Delete Current Folder
          </Button>
        ) : (
          ''
        )}
      </span>
    </div>
  );
};
export default BucketSettings;
