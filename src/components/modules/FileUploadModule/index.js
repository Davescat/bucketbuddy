import React, { useRef, useState, useEffect } from 'react';
import { Modal, Form, Segment, Input } from 'semantic-ui-react';
import { uploadObject } from '../../utils/amazon-s3-utils';
import { selectBoolean } from '../../utils/tag-types';

const FileUploadModule = (props) => {
  const [tagInput, setTagInput] = useState(props.schemaInfo);
  const fileInput = useRef(null);

  const isFormFilled = () => {
    return tagInput.tagset.length > 0
      ? !tagInput.tagset.map((x) => x['value']).includes('')
      : true;
  };

  const upload = () => {
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
          props.control.close();
          props.updateList();
        }
      );
    }
  };

  useEffect(() => {
    setTagInput(props.schemaInfo);
  }, [props.control.status, props.schemaInfo]);

  const handleFieldChange = (event, { name, value }, row = -1) => {
    const schemaValues = tagInput.tagset;
    if (row !== -1) {
      schemaValues[parseInt(row)][name] = value;
    } else {
      schemaValues[parseInt(event.target.id)][name] = value;
    }
    setTagInput({ available: true, tagset: schemaValues });
  };

  return (
    <Modal
      onClose={() => props.control.close()}
      open={props.control.status}
      trigger={props.trigger}
      closeIcon
    >
      <Modal.Header>Select an Image to Upload</Modal.Header>
      <Modal.Content>
        <Segment>
          <Form>
            <Form.Field>
              <Input ref={fileInput} label="File" id="fileupload" type="file" />
            </Form.Field>
            {props.schemaInfo.available &&
              tagInput.tagset.map((schemaValue, idx) => {
                const key = 'key',
                  value = 'value',
                  type = 'type';
                return schemaValue[type] === 'flag' ? (
                  <Form.Select
                    key={schemaValue[key]}
                    width={6}
                    fluid
                    id={'' + idx}
                    name={value}
                    options={selectBoolean}
                    label={schemaValue[key]}
                    defaultValue={
                      typeof schemaValue[value] === 'boolean'
                        ? schemaValue[value]
                        : selectBoolean[0].value
                    }
                    onChange={(event, data) =>
                      handleFieldChange(event, data, idx)
                    }
                  />
                ) : (
                  <Form.Input
                    key={schemaValue[key]}
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
              onClick={() => upload()}
              id="uploadButton"
              disabled={!isFormFilled()}
              type="submit"
            >
              Upload
            </Form.Button>
          </Form>
        </Segment>
      </Modal.Content>
    </Modal>
  );
};

export default FileUploadModule;
