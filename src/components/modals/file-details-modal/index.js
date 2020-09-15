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
  Button,
  Label,
  Icon,
  Placeholder,
  Message
} from 'semantic-ui-react';
import { deleteObject, getSignedURL } from '../../utils/amazon-s3-utils';
import { schemaFileName } from '../../modules/BucketViewer';
import EditObjectTagsModal from '../edit-tags-modal';
import { withRouter } from 'react-router-dom';

const FileDetailsModal = (props) => {
  const [dataLoaded, setDataLoaded] = useState(props.tagInfo.tagsLoaded);
  const [conformsToSchema, setConformsToSchema] = useState(true);
  const [downloadLink, setDownloadLink] = useState('');
  const fileTest = /\.(jpe?g|png|gif|bmp)$/i;
  const {
    file,
    bucket,
    schemaInfo,
    tagInfo: { fileTags, setFileTags }
  } = props;
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
    if (props.tagInfo.tagsLoaded != dataLoaded) {
      setDataLoaded(props.tagInfo.tagsLoaded);
    }
    if (fileTags && fileTags.TagSet.length > 0) {
      let schemaKeys = getKeys(schemaInfo.tagset, 'key');
      let fileKeys = getKeys(fileTags.TagSet, 'Key');
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
    if (dataLoaded) {
      if (fileTest.test(file.filename)) {
        return <Image wrapped size="medium" src={file.src} />;
      } else {
        return <Icon name="file" className="card-file-icon" />;
      }
    } else {
      return (
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
      );
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
          {dataLoaded ? (
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
              {fileTags &&
                fileTags.TagSet.map((set, i) => (
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
                  {file.filename !== schemaFileName && (
                    <EditObjectTagsModal
                      bucket={bucket}
                      keyValue={file.Key}
                      tagset={cleanTagSetValuesForForm(
                        conformsToSchema
                          ? fileTags.TagSet
                          : Object.assign(
                              [],
                              fileTags.TagSet,
                              schemaInfo.tagset
                            )
                      )}
                      setFileTags={setFileTags}
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
                  <Button color="red" onClick={deleteFile}>
                    Delete File
                  </Button>
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
};
export default withRouter(FileDetailsModal);
