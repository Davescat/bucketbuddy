import React, { useState, useEffect } from 'react';
import { Modal, Dimmer, Loader } from 'semantic-ui-react';
import AWS from 'aws-sdk';
import { getObject } from '../../utils/amazon-s3-utils';
import SchemaForm from '../../schema-form';

const SchemaStructureModal = (props) => {
  const bucketBuddySchemaFileName = 'bucket-buddy-schema.json';

  const [dataLoaded, setDataLoaded] = useState(false);
  const [isCreateSchema, setIsCreateSchema] = useState(true);
  const [jsonSchemaValues, setJsonSchemaValues] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const getData = () => {
    return getObject(props.bucket, bucketBuddySchemaFileName);
  };

  const setToCreateSchema = () => {
    setDataLoaded(true);
    setIsCreateSchema(true);
  };

  const setData = (response) => {
    setDataLoaded(true);
    //TODO HERE GET JSON DATA
    setIsCreateSchema(false);
    console.log(response);
    setJsonSchemaValues('');
  };

  const createSchemaFile = (schemaValues) => {
    //TODO actually create the bucket-buddy-schema.json with values
    console.log('MODAL ' + schemaValues);

    setModalOpen(false);
    props.updateList();
  };

  useEffect(() => {
    if (modalOpen && !dataLoaded) {
      getData().then(setData, setToCreateSchema);
    }
  });

  return (
    <Modal
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      open={modalOpen}
      trigger={props.trigger}
    >
      <Modal.Content>
        {dataLoaded ? (
          isCreateSchema ? (
            <SchemaForm
              actionOnSubmit={createSchemaFile}
              title="Create Schema"
              editFieldName={isCreateSchema}
            />
          ) : (
            <SchemaForm
              actionOnSubmit={createSchemaFile}
              title="Edit Schema"
              editFieldName={isCreateSchema}
              schemaValues={jsonSchemaValues}
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
export default SchemaStructureModal;
