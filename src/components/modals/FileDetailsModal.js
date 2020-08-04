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

export default function FileDetailsModal(props) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [objectData, setObjectData] = useState({});

  const getData = () => {
    const key = props.file.Key;
    const {
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = props;

    return (async function () {
      try {
        AWS.config.update({
          accessKeyId,
          secretAccessKey,
          region
        });
        const s3 = new AWS.S3();
        const res = await s3
          .getObject({
            Bucket: name,
            Key: key
          })
          .promise()
          .then((response) => {
            return response;
          });

        return res;
      } catch (e) {
        console.log('My error', e);
      }
    })();
  };

  /**
   *
   * @param {AWS.S3.GetObjectOutput} response
   */
  const setData = (response) => {
    setDataLoaded(true);
    setObjectData({ response });
  };

  const deleteObject = () => {
    const key = props.file.Key;
    const {
      bucket: { accessKeyId, secretAccessKey, region, name },
      handleClose,
      updateList
    } = props;

    return (async function () {
      try {
        AWS.config.update({
          accessKeyId,
          secretAccessKey,
          region
        });
        const s3 = new AWS.S3();
        const res = await s3
          .deleteObject({
            Bucket: name,
            Key: key
          })
          .promise()
          .then((response) => {
            handleClose();
            updateList();
            return response;
          });

        return res;
      } catch (e) {
        console.log('My error', e);
      }
    })();
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
                  <Button onClick={deleteObject}>Delete File</Button>
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
}
