import React from 'react';
import { Card } from 'semantic-ui-react';
import File from './File';

const FileContainer = (props) => {
  const {
    bucket,
    files: { files, folders }
  } = props;
  return (
    <Card.Group className="file-container">
      {folders &&
        folders.length > 0 &&
        folders.map((x, i) => (
          <File
            bucket={bucket}
            key={`${i}${x.ETag}`}
            file={x}
            updateList={props.updateList}
            settings={props.settings}
            customClickEvent={props.pathChange}
          />
        ))}
      {files &&
        files.length > 0 &&
        files.map((x, i) => (
          <File
            bucket={bucket}
            key={`${i}${x.ETag}`}
            file={x}
            updateList={props.updateList}
            settings={props.settings}
            customClickEvent={props.pathChange}
          />
        ))}
    </Card.Group>
  );
};
export default FileContainer;
