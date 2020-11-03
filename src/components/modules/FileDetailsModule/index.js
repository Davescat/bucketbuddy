import React, { useState, useEffect } from 'react';
import {
  deleteObject,
  // getSignedURL,
  getObjectURL
} from '../../utils/amazon-s3-utils';
import { schemaFileName } from '../BucketViewer';
import EditObjectTagsModule from '../EditObjectTagsModule';
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
  Confirm,
  Grid,
  GridRow,
  GridColumn,
  Segment
} from 'semantic-ui-react';
import './file-details-modal.scss';

const FileDetailsModule = (props) => {
  const { bucket, schemaInfo, updateTagState } = props;
  const [showConfirm, setShowConfirm] = useState(false);
  const [conformsToSchema, setConformsToSchema] = useState(true);
  const [downloadLink, setDownloadLink] = useState('');
  // This property is the combined tags of the files tags and the schema's tags
  const [file, setFile] = useState(props.file);
  const fileTest = /\.(jpe?g|png|gif|bmp)$/i;

  useEffect(() => {
    if (file && file === props.file) {
      if (downloadLink === '') {
        getObjectURL(bucket, file.Key).then(setDownloadLink);
      }
      if (file.TagSet && file.TagSet.length > 0) {
        const schemaKeys = getKeys(schemaInfo.tagset);
        const fileKeys = getKeys(file.TagSet);
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
    } else if (props.file !== file) {
      //TODO there appears to be a bug here where the file is not being set correctly and downloads the wrong file
      setFile(props.file);
    }
  }, [file, props.file, downloadLink, bucket, schemaInfo]);

  // const showConfirmDelete = () => {
  //   setShowConfirm(true);
  // };

  // const closeConfirmDelete = () => {
  //   setShowConfirm(false);
  // };

  /**
   * Returns the keys of a tagset.
   *
   * @param {AWS.S3.GetObjectOutput} response
   */
  const getKeys = (array, keyName = 'key') => {
    if (array.length > 0) {
      return array.map((val) => val[keyName]).sort();
    } else {
      return [];
    }
  };

  const deleteFile = () => {
    deleteObject(bucket, file.Key).then(() => {
      setFile(null);
      props.handleClose();
      props.updateList();
    });
  };

  const getImage = () => {
    if (fileTest.test(file.filename)) {
      return (
        <div className="ui medium middle aligned image">
          <img crossOrigin="anonymous" src={file.src} alt="File Thumbnail" />
        </div>
      );
    } else {
      return <Icon name="file" className="card-file-icon" />;
    }
  };

  const combineTags = () => {
    //The reason for creating and turning the set back into the array was to
    //quickly get rid of repeating values as a set only contains unique values.
    const totalKeys = [
      ...new Set([...getKeys(schemaInfo.tagset), ...getKeys(file.TagSet)])
    ];
    if (totalKeys) {
      return totalKeys.reduce((acc, key) => {
        let schemaSet = schemaInfo.tagset.find((set) => set['key'] === key);
        let fileSet = file.TagSet.find((set) => set['key'] === key);
        acc.push({
          tags: {
            ...schemaSet,
            ...fileSet
          },
          showNeeded: schemaSet && !fileSet
        });
        return acc;
      }, []);
    }
  };
  return (
    <Modal
      open={props.modalOpen}
      onClose={() => {
        setFile(null);
        props.handleClose();
      }}
      className="details-modal"
      closeIcon
    >
      <Modal.Header>{file && file.filename}</Modal.Header>
      {file && (
        <Modal.Content image>
          {file.filename !== schemaFileName && getImage()}
          <Modal.Description>
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
            <Segment className="file-segment">
              {!conformsToSchema && file.filename !== schemaFileName && (
                <Label color="red" ribbon>
                  Does not conform to Schema
                </Label>
              )}
              <Grid columns={file.filename === schemaFileName ? 2 : 1}>
                <GridRow divided>
                  <GridColumn>
                    <List className="file-details" divided>
                      <Label attached="top">File Data</Label>
                      <List.Item key={file.Key + '1'}>
                        <ListContent>
                          <ListHeader>Path</ListHeader>
                          <ListDescription>{file.Key}</ListDescription>
                        </ListContent>
                      </List.Item>
                      {file.TagSet &&
                        file.TagSet.map((set, i) => (
                          <List.Item key={i}>
                            <ListContent>
                              <ListHeader>{set.key}</ListHeader>
                              <ListDescription>{set.value}</ListDescription>
                            </ListContent>
                          </List.Item>
                        ))}
                      <List.Item key={file.Key + '2'}>
                        <ListContent>
                          <ListHeader>LastModified</ListHeader>
                          <ListDescription>
                            {file.LastModified.toString()}
                          </ListDescription>
                        </ListContent>
                      </List.Item>
                      <List.Item key={file.Key + '3'}>
                        <ListContent>
                          <ListHeader>Size</ListHeader>
                          <ListDescription>{file.Size}</ListDescription>
                        </ListContent>
                      </List.Item>
                      <List.Item key={file.Key + '4'}>
                        <ListContent>
                          <ListHeader>Storage Class</ListHeader>
                          <ListDescription>{file.StorageClass}</ListDescription>
                        </ListContent>
                      </List.Item>
                      <List.Item key={file.Key + '5'}>
                        <ListContent>
                          {file.TagSet && file.filename !== schemaFileName && (
                            <EditObjectTagsModule
                              bucket={bucket}
                              keyValue={file.Key}
                              tagset={combineTags()}
                              updateTagState={(key, tagset) => {
                                setFile(
                                  Object.assign(file, { TagSet: tagset })
                                );
                                updateTagState(key, tagset);
                              }}
                              trigger={<Button size="medium">Edit Tags</Button>}
                            />
                          )}
                          {downloadLink !== '' && (
                            <a
                              download=""
                              href={downloadLink}
                              target="_blank"
                              className="ui button"
                              rel="noopener noreferrer"
                              role="button"
                            >
                              Download
                            </a>
                          )}
                          <Button
                            color="blue"
                            onClick={() => setShowConfirm(true)}
                          >
                            Delete File
                          </Button>
                          <Confirm
                            open={showConfirm}
                            cancelButton="Cancel"
                            confirmButton="Delete"
                            onCancel={() => setShowConfirm(false)}
                            onConfirm={deleteFile}
                          />
                        </ListContent>
                      </List.Item>
                    </List>
                  </GridColumn>

                  {file.filename === schemaFileName && (
                    <GridColumn>
                      <List className="file-details" divided>
                        <Label attached="top">Schema Tags</Label>
                        {schemaInfo.tagset &&
                          schemaInfo.tagset.map((set, i) => (
                            <List.Item key={file.Key + i}>
                              <ListContent>
                                <ListHeader>{set.key}</ListHeader>
                                <ListDescription>{set.value}</ListDescription>
                              </ListContent>
                            </List.Item>
                          ))}
                      </List>
                    </GridColumn>
                  )}
                </GridRow>
              </Grid>
            </Segment>
          </Modal.Description>
        </Modal.Content>
      )}
    </Modal>
  );
};
export default withRouter(FileDetailsModule);
