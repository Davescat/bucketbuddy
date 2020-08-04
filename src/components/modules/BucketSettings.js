import React from 'react';
import { Button } from 'semantic-ui-react';
import FileUploadModal from '../modals/FileUploadModal';

/**
 * This component controls how much info you want to load in from the api
 */
export default function BucketSettings({ updateList, bucket, pathInfo }) {
  return (
    <div className="bucket-bar">
      <span className="bucket-settings"></span>
      <span className="bucket-buttons">
        <FileUploadModal
          updateList={updateList}
          bucket={bucket}
          pathInfo={pathInfo}
          trigger={<Button size="medium">Upload</Button>}
        />
      </span>
    </div>
  );
}
