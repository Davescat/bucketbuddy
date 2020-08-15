import React from 'react';
import { Button } from 'semantic-ui-react';
import FileUploadModal from '../modals/file-upload-modal';
import FolderUploadModal from '../modals/folder-upload-modal';
import SchemaStructureModal from '../modals/schema-structure-modal';

/**
 * This component controls how much info you want to load in from the api
 */
const BucketSettings = ({ updateList, bucket, pathInfo, schemaInfo }) => {
  return (
    <div className="bucket-bar">
      <span className="bucket-settings"></span>
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
    </div>
  );
};
export default BucketSettings;
