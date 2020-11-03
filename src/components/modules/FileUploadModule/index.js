import React, { useRef, useState, useEffect } from 'react';
import { Modal, Form, Segment } from 'semantic-ui-react';
import { uploadObject } from '../../utils/amazon-s3-utils';

const FileUploadModule = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState(props.schemaInfo);
  const fileInput = useRef(null);

  const isFormFilled = () => {
    tagInput.tagset.map((x) => x['value']).includes('');
  };

  const upload = () => {
    //TODO There seems to be an issue here where fileInput is always null.
    if (
      fileInput &&
      fileInput.current !== null &&
      fileInput.current.inputRef.current.files.length === 1
    ) {
      let file = fileInput.current.inputRef.current.files[0];
      const tags =
        tagInput.tagset.length > 0 &&
        tagInput.tagset.reduce((previousValue, currentValue, i) => {
          const key = 'key',
            value = 'value';
          if (i === 1) {
            return `${previousValue[key]}=${previousValue[value]}&${currentValue[key]}=${currentValue[value]}`;
          } else {
            return `${previousValue}&${currentValue[key]}=${currentValue[value]}`;
          }
        });
      uploadObject(props.bucket, props.pathInfo.path, file, tags).then(
        (response) => {
          setModalOpen(false);
          props.updateList();
        }
      );
    }
  };

  useEffect(() => {
    setTagInput(props.schemaInfo);
  }, [modalOpen, props.schemaInfo]);

  const handleFieldChange = (event, { name, value }) => {
    const schemaValues = tagInput.tagset;
    schemaValues[parseInt(event.target.id)][name] = value;
    setTagInput({ available: true, tagset: schemaValues });
  };

  return (
    <Modal
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      open={modalOpen}
      trigger={props.trigger}
      closeIcon
    >
      <Modal.Header>Select an Image to Upload</Modal.Header>
      <Modal.Content>
        <Segment>
          <Form onSubmit={upload}>
            <Form.Input
              ref={fileInput}
              label="File"
              id="fileupload"
              type="file"
            />
            {props.schemaInfo.available &&
              tagInput.tagset.map((schemaValue, idx) => {
                const key = 'key',
                  value = 'value',
                  type = 'type';
                return (
                  <Form.Input
                    label={schemaValue[key]}
                    name={value}
                    id={'' + idx}
                    type={schemaValue[type]}
                    required
                    placeholder="Enter field input here"
                    onChange={handleFieldChange}
                    value={schemaValue[value]}
                  />
                );
              })}
            <Form.Button
              disabled={isFormFilled()}
              type="submit"
              content={'Upload'}
            />
          </Form>
        </Segment>
      </Modal.Content>
    </Modal>
  );
};

export default FileUploadModule;
