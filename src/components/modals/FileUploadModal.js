import React, { useRef, useState } from 'react';
import AWS from 'aws-sdk';
import { Button, Modal, Form, Input, Icon, Label } from 'semantic-ui-react';

const FileUploadModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const fileInput = useRef(null);

  /**
   *
   * @param {Event} event
   */
  const upload = () => {
    const {
      updateList,
      pathInfo,
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = props;
    if (fileInput && fileInput.current.inputRef.current.files.length === 1) {
      let file = fileInput.current.inputRef.current.files[0];
      return (async function () {
        try {
          AWS.config.update({
            accessKeyId,
            secretAccessKey,
            region
          });
          new AWS.S3.ManagedUpload({
            params: {
              Body: file,
              Bucket: name,
              Key: `${pathInfo.path}${file.name}`
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
                  'There was an error uploading your photo: ',
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
      <Modal.Header>Select an Image to Uploads</Modal.Header>
      <Modal.Content>
        <Form onSubmit={upload}>
          {props.schemaInfo.avaliable &&
            props.schemaInfo.tagset.map((schemaValue, idx) => {
              const key = 'key',
                value = 'value';
              return (
                <Form.Group widths="equal" className="field-row">
                  {props.editFieldName ? (
                    <Form.Input
                      fluid
                      name={key}
                      label="Field Name"
                      id={'' + idx}
                      required
                      placeholder="Enter field name here"
                      value={schemaValue[key]}
                    />
                  ) : (
                    <Label>{schemaValue[key]}</Label>
                  )}
                  <Form.Input
                    fluid
                    name={value}
                    id={'' + idx}
                    required
                    placeholder="Enter field input here"
                    value={schemaValue[value]}
                  />
                </Form.Group>
              );
            })}
          <Form.Field>
            <Input ref={fileInput} id="fileupload" type="file" />
            <Button type="submit">Upload</Button>
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
export default FileUploadModal;
