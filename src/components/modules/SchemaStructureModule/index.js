import React, { useState, useEffect } from 'react';
import { Modal, Dimmer, Loader } from 'semantic-ui-react';
import AWS from 'aws-sdk';
import SchemaForm from '../SchemaForm';

const SchemaStructureModule = (props) => {
  const bucketBuddySchemaFileName = 'bucket-buddy-schema.json';

  const [schemaPath, setSchemaPath] = useState(props.pathInfo.path);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [jsonSchemaValues, setJsonSchemaValues] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const setToCreateSchema = () => {
    setDataLoaded(true);
  };

  const createSchemaFile = (schemaValues) => {
    const accessKeyId = props.bucket.accessKeyId;
    const secretAccessKey = props.bucket.secretAccessKey;
    const region = props.bucket.region;
    const name = props.bucket.name;

    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region
    });
    new AWS.S3.ManagedUpload({
      params: {
        Body: JSON.stringify(schemaValues),
        Bucket: name,
        Key: `${props.pathInfo.path}${bucketBuddySchemaFileName}`
      }
    })
      .promise()
      .then(
        (data) => {
          setModalOpen(false);
          props.updateList();
          window.location.reload();
        },
        (err) => {
          return alert(
            'There was an error uploading the json file',
            err.message
          );
        }
      );
  };

  useEffect(() => {
    if (schemaPath !== props.pathInfo.path) {
      setDataLoaded(false);
      setSchemaPath(props.pathInfo.path);
      setJsonSchemaValues(null);
    }
    if (modalOpen && !dataLoaded) {
      if (props.schemaInfo.available) {
        setJsonSchemaValues(props.schemaInfo.tagset);
        setDataLoaded(true);
      } else {
        setToCreateSchema();
      }
    }
  }, [
    schemaPath,
    props.pathInfo.path,
    props.schemaInfo.available,
    props.schemaInfo.tagset,
    modalOpen,
    dataLoaded
  ]);

  return (
    <Modal
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      open={modalOpen}
      trigger={props.trigger}
      closeIcon
    >
      <Modal.Content>
        {dataLoaded ? (
          jsonSchemaValues ? (
            <SchemaForm
              actionOnSubmit={createSchemaFile}
              title="Edit Schema"
              editFieldName={true}
              schemaValues={jsonSchemaValues.map((set) => ({ tags: set }))}
            />
          ) : (
            <SchemaForm
              actionOnSubmit={createSchemaFile}
              title="Create Schema"
              editFieldName={true}
            />
          )
        ) : (
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        )}
      </Modal.Content>
    </Modal>
  );
};
export default SchemaStructureModule;
