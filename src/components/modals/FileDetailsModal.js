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
  Button,
  Label,
  Icon,
  Placeholder
} from 'semantic-ui-react';
import { getObjectTags, deleteObject } from '../utils/amazon-s3-utils';

const FileDetailsModal = (props) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [conformsToSchema, setConformsToSchema] = useState(true);
  const [fileTags, setfileTags] = useState({ TagSet: [] });
  const fileTest = /\.(jpe?g|png|gif|bmp)$/i;
  const { file } = props;

  const getData = () => {
    return getObjectTags(props.bucket, props.file.Key);
  };

  /**
   *
   * @param {AWS.S3.GetObjectOutput} response
   */
  const getKeys = (array, keyName = 'key') => {
    if (array.length > 0) {
      return array.map((val) => val[keyName]).sort();
    }
  };

  const setData = (response) => {
    setDataLoaded(true);
    setfileTags(response);
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
    if (fileTags.TagSet.length > 0) {
      let schemaKeys = getKeys(props.schemaInfo.tagset, 'key');
      let fileKeys = getKeys(fileTags.TagSet, 'Key');
      setConformsToSchema(
        schemaKeys.every((schemaKey) => fileKeys.includes(schemaKey))
      );
    } else {
      setConformsToSchema(props.schemaInfo.available === false);
    }
  });

  const getImage = () => {
    if (dataLoaded) {
      if (fileTest.test(file.filename)) {
        return <Image wrapped size="medium" src={file.src} />;
      } else {
        return <Icon name="file" className="card-file-icon" />;
      }
    } else {
      return (
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
      );
    }
  };

  return (
    <Modal
      open={props.modalOpen}
      onClose={props.handleClose}
      className="details-modal"
    >
      <Modal.Header>{file.filename}</Modal.Header>
      <Modal.Content image>
        {getImage()}
        <Modal.Description>
          {dataLoaded ? (
            <List className="file-details" divided>
              {!conformsToSchema && (
                <Label color="red" ribbon>
                  Does not conform to Schema
                </Label>
              )}
              <List.Item>
                <ListContent>
                  <ListHeader>Path</ListHeader>
                  <ListDescription>{file.Key}</ListDescription>
                </ListContent>
              </List.Item>
              {fileTags.TagSet.map((set, i) => (
                <List.Item>
                  <ListContent>
                    <ListHeader>{set.Key}</ListHeader>
                    <ListDescription>{set.Value}</ListDescription>
                  </ListContent>
                </List.Item>
              ))}
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
