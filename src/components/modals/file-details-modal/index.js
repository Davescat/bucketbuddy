import React, { useRef, useState, useEffect } from 'react';
import { deleteObject, getSignedURL } from '../../utils/amazon-s3-utils';
import { schemaFileName } from '../../modules/BucketViewer';
import EditObjectTagsModal from '../edit-tags-modal';
import { withRouter } from 'react-router-dom';
import {
  Modal,
  List,
  ListHeader,
  ListDescription,
  ListContent,
  Button,
  Label,
  Icon,
  Message,
  Confirm
} from 'semantic-ui-react';

const FileDetailsModal = (props) => {
  const [dataLoaded, setDataLoaded] = useState(props.tagInfo.tagsLoaded);
  const [showConfirm, setShowConfirm] = useState(false);
  const [conformsToSchema, setConformsToSchema] = useState(true);
  const [src, setSrc] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const fileTest = /\.(jpe?g|png|gif|bmp)$/i;
  const imagec = useRef(null);
  const {
    file,
    bucket,
    schemaInfo,
    tagInfo: { updateTagState }
  } = props;

  const showConfirmDelete = () => {
    setShowConfirm(true);
  };

  const closeConfirmDelete = () => {
    setShowConfirm(false);
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

  const deleteFile = () => {
    deleteObject(bucket, file.Key);
    props.handleClose();
    props.updateList();
  };

  useEffect(() => {
    if (downloadLink === '') {
      getSignedURL(bucket, file.Key).then(setDownloadLink);
    }
    if (file.TagSet && file.TagSet.length > 0) {
      let schemaKeys = getKeys(schemaInfo.tagset, 'key');
      let fileKeys = getKeys(file.TagSet, 'Key');
      if (schemaKeys) {
        setConformsToSchema(
          schemaKeys.every((schemaKey) => fileKeys.includes(schemaKey))
        );
      }
    } else {
      if (schemaInfo) {
        setConformsToSchema(schemaInfo.available === false);
      } else {
        setConformsToSchema(false);
      }
    }
  });

  const getImage = () => {
    if (fileTest.test(file.filename)) {
      //Using "div" and "img" instead of the Image object so that a ref could be made
      return (
        <div class="ui medium middle aligned image">
          {' '}
          <img crossOrigin="anonymous" ref={imagec} src={file.src} />
        </div>
      );
    } else {
      return <Icon name="file" className="card-file-icon" />;
    }
  };

  const cleanTagSetValuesForForm = (tagset) => {
    const newTagset = [];
    tagset.map((set, i) =>
      newTagset.push({
        key: set.Key ? set.Key : set.key,
        value: set.Value ? set.Value : set.value
      })
    );

    return newTagset;
  };

  return (
    <Modal
      open={props.modalOpen}
      onClose={props.handleClose}
      className="details-modal"
      closeIcon
    >
      <Modal.Header>{file.filename}</Modal.Header>
      <Modal.Content image>
        {getImage()}
        <Modal.Description>
          <List className="file-details" divided>
            {!conformsToSchema && file.filename !== schemaFileName && (
              <Label color="red" ribbon>
                Does not conform to Schema
              </Label>
            )}
            {file.filename === schemaFileName && (
              <Message className="s3-message">
                <Message.Header>Bucket Buddy Schema</Message.Header>
                <p>
                  This file is so we know what values you want to set to your
                  objects' tags.
                  <br />
                  You can delete this but you will have to make another one
                </p>
              </Message>
            )}
            <List.Item>
              <ListContent>
                <ListHeader>Path</ListHeader>
                <ListDescription>{file.Key}</ListDescription>
              </ListContent>
            </List.Item>
            {file.TagSet &&
              file.TagSet.map((set, i) => (
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
                {file.TagSet && file.filename !== schemaFileName && (
                  <EditObjectTagsModal
                    bucket={bucket}
                    keyValue={file.Key}
                    tagset={cleanTagSetValuesForForm(
                      conformsToSchema
                        ? file.TagSet
                        : Object.assign([], file.TagSet, schemaInfo.tagset)
                    )}
                    updateTagState={updateTagState}
                    trigger={<Button size="medium">Edit Tags</Button>}
                  />
                )}
                {downloadLink !== '' && (
                  <a
                    download=""
                    href={downloadLink}
                    target="_blank"
                    class="ui button"
                    role="button"
                  >
                    Download
                  </a>
                )}
                <Button color="red" onClick={showConfirmDelete}>
                  Delete File
                </Button>
                <Confirm
                  open={showConfirm}
                  cancelButton="Cancel"
                  confirmButton="Delete"
                  onCancel={closeConfirmDelete}
                  onConfirm={deleteFile}
                />
              </ListContent>
            </List.Item>
          </List>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
export default withRouter(FileDetailsModal);
