import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { putObjectTags } from '../../utils/amazon-s3-utils';
import SchemaForm from '../../schema-form';

const EditObjectTagsModal = (props) => {
  const bucketBuddySchemaFileName = 'bucket-buddy-schema.json';

  const [modalOpen, setModalOpen] = useState(false);

  const updateObjectTags = (tagset) => {
    const accessKeyId = props.bucket.accessKeyId;
    const secretAccessKey = props.bucket.secretAccessKey;
    const region = props.bucket.region;
    const name = props.bucket.name;
    const key = props.keyValue;

    const targetSetForCall = cleanTagSetValuesForCall(tagset);
    putObjectTags(
      { name, accessKeyId, secretAccessKey, region },
      key,
      targetSetForCall
    );
    props.updateTagState(key, tagset);

    setModalOpen(false);
  };

  const cleanTagSetValuesForCall = (tagset) => {
    const newTagset = [];

    tagset.map((set, i) => newTagset.push({ Key: set.key, Value: set.value }));

    return { TagSet: newTagset };
  };

  return (
    <Modal
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      open={modalOpen}
      trigger={props.trigger}
      closeIcon
    >
      <Modal.Content>
        <SchemaForm
          actionOnSubmit={updateObjectTags}
          title="Edit Tags"
          description="Enter the tag names and inputs to be applied"
          editFieldName={true}
          schemaValues={props.tagset}
        />
      </Modal.Content>
    </Modal>
  );
};
export default EditObjectTagsModal;
