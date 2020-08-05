import React, { useState, useEffect } from 'react';
import {
  Modal,
  Image,
  List,
  ListHeader,
  ListDescription,
  ListContent,
  Dimmer,
  Loader,
  Button
} from 'semantic-ui-react';
import AWS from 'aws-sdk';
import { getObject, deleteObject } from '../utils/amazon-s3-utils';

const FileDetailsModal = (props) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [objectData, setObjectData] = useState({});

  const getData = () => {
    return getObject(props.bucket, props.file.Key);
  };

  /**
   *
   * @param {AWS.S3.GetObjectOutput} response
   */
  const setData = (response) => {
    setDataLoaded(true);
    setObjectData(response);
  };

  const deleteFile = () => {
    deleteObject(props.bucket, props.file.Key);
    props.handleClose();
    props.updateList();
  };

  useEffect(() => {
    if (props.modalOpen && !dataLoaded) {
      getData().then(setData);
    }
  });

  const { file } = props;
  return (
    <Modal open={props.modalOpen} onClose={props.handleClose}>
      <Modal.Header>{file.filename}</Modal.Header>
      <Modal.Content image>
        <Image wrapped size="medium" src={file.src} />
        <Modal.Description>
          {dataLoaded ? (
            <List className="file-details" divided relaxed>
              <List.Item>
                <ListContent>
                  <ListHeader>Key</ListHeader>
                  <ListDescription>{file.Key}</ListDescription>
                </ListContent>
              </List.Item>
              <List.Item>
                <ListContent>
                  <ListHeader>LastModified</ListHeader>
                  <ListDescription>
                    {file.LastModified.toString()}
                  </ListDescription>
                </ListContent>
              </List.Item>
              <List.Item>
                <ListContent>
                  <ListHeader>Size</ListHeader>
                  <ListDescription>{file.Size}</ListDescription>
                </ListContent>
              </List.Item>
              <List.Item>
                <ListContent>
                  <ListHeader>Storage Class</ListHeader>
                  <ListDescription>{file.StorageClass}</ListDescription>
                </ListContent>
              </List.Item>
              <List.Item>
                <ListContent>
                  <Button onClick={deleteFile}>Delete File</Button>
                </ListContent>
              </List.Item>
            </List>
          ) : (
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          )}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
export default FileDetailsModal;
