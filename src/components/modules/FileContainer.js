import React from 'react';
import { Card } from 'semantic-ui-react';
import File from './File';

const FileContainer = (props) => {
  const { bucket, files } = props;

  return (
    <Card.Group className="file-container" doubling>
      {files &&
        files.length > 0 &&
        files.map((x, i) => (
          <File
            bucket={bucket}
            key={`${i}${x.filename}`}
            file={x}
            updateTagState={props.updateTagState}
            schemaInfo={props.schemaInfo}
            updateList={props.updateList}
            settings={props.settings}
            customClickEvent={props.pathChange}
          />
        ))}
    </Card.Group>
  );
};
export default FileContainer;
