import React, { useState } from 'react';
import AWS from 'aws-sdk';
import { Modal, Form, Segment } from 'semantic-ui-react';

const FolderUploadModule = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [textInput, setTextInput] = useState('');

  const upload = () => {
    const {
      updateList,
      pathInfo,
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = props;

    if (textInput && textInput !== '') {
      const folderName = `${pathInfo.path}${textInput}/`;
      return (async function () {
        try {
          AWS.config.update({
            accessKeyId,
            secretAccessKey,
            region
          });
          new AWS.S3.ManagedUpload({
            params: {
              Body: '',
              Bucket: name,
              Key: folderName
            }
          })
            .promise()
            .then(
              (data) => {
                setModalOpen(false);
                updateList(pathInfo.path);
              },
              (err) => {
                return alert(
                  'There was an error creating the folder ',
                  err.message
                );
              }
            );
        } catch (e) {
          console.log('My error', e);
        }
      })();
    }
  };

  return (
    <Modal
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      open={modalOpen}
      trigger={props.trigger}
      closeIcon
    >
      <Modal.Header>Create New Folder</Modal.Header>
      <Modal.Content>
        <Segment>
          <Form onSubmit={upload}>
            <Form.Input
              label="Folder Name"
              value={textInput}
              onChange={(event, { value }) => setTextInput(value)}
              id="foldername"
              type="text"
            />
            <Form.Button type="submit">Add folder</Form.Button>
          </Form>
        </Segment>
      </Modal.Content>
    </Modal>
  );
};
export default FolderUploadModule;
