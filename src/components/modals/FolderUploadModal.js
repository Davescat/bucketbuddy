import React, { useRef, useState } from 'react';
import AWS from 'aws-sdk';
import { Button, Radio, Modal, Form, Input } from 'semantic-ui-react';

const FolderUploadModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const textInput = useRef(null);

  const upload = () => {
    const {
      updateList,
      pathInfo,
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = props;
    // TODO: validate text for creating folder
    if (textInput && textInput.current.inputRef.current.value != '') {
      const folderName = `${pathInfo.path}${textInput.current.inputRef.current.value}/`;
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
                updateList();
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
    >
      <Modal.Header>Create New Folder</Modal.Header>
      <Modal.Content>
        <Form onSubmit={upload}>
          <Form.Field>
            <Radio label="Inherit Schema" toggle name="loadTags" />
          </Form.Field>
          <Form.Field>
            <Input
              label="Folder Name"
              ref={textInput}
              id="foldername"
              type="text"
            />
          </Form.Field>
          <Form.Field>
            <Button type="submit">Create</Button>
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
export default FolderUploadModal;
