import React, { useState } from 'react';
import { Card, List, Button, Transition } from 'semantic-ui-react';
import File from './File';
import ListFile from './ListFile';

const FileContainer = (props) => {
  const {
    bucket,
    files: { files, folders },
    isLoading
  } = props;

  if (props.card)
    return (
      <Transition visible={!isLoading} animation={'fly left'} duration={2000}>
        <span>
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
        </span>
      </Transition>
    );
  else
    return (
      <List className="file-list" animated verticalAlign="middle">
        {folders &&
          folders.length > 0 &&
          folders.map((x, i) => (
            <ListFile
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
            <ListFile
              bucket={bucket}
              key={`${i}${x.ETag}`}
              file={x}
              updateList={props.updateList}
              settings={props.settings}
              customClickEvent={props.pathChange}
            />
          ))}
      </List>
    );
};
export default FileContainer;
