import React, { Component } from 'react';
import {
  Modal,
  Image,
  List,
  ListHeader,
  ListDescription,
  ListContent,
  Dimmer,
  Loader,
  Button
} from 'semantic-ui-react';
import AWS from 'aws-sdk';

export class FileDetailsModal extends Component {
  state = {
    objectData: {},
    dataLoaded: false
  };

  getData = () => {
    const key = this.props.file.Key;
    const {
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = this.props;

    return (async function () {
      try {
        AWS.config.setPromisesDependency();
        AWS.config.update({
          accessKeyId,
          secretAccessKey,
          region
        });
        const s3 = new AWS.S3();
        const res = await s3
          .getObject({
            Bucket: name,
            Key: key
          })
          .promise()
          .then((response) => {
            return response;
          });

        return res;
      } catch (e) {
        console.log('My error', e);
      }
    })();
  };

  /**
   *
   * @param {AWS.S3.GetObjectOutput} response
   */
  setData = (response) => {
    this.setState(
      {
        dataLoaded: true,
        objectData: response
      },
      () => console.log(this.state)
    );
  };

  deleteObject = () => {
    const key = this.props.file.Key;
    const {
      bucket: { accessKeyId, secretAccessKey, region, name },
      handleClose,
      updateList
    } = this.props;

    return (async function () {
      try {
        AWS.config.setPromisesDependency();
        AWS.config.update({
          accessKeyId,
          secretAccessKey,
          region
        });
        const s3 = new AWS.S3();
        const res = await s3
          .deleteObject({
            Bucket: name,
            Key: key
          })
          .promise()
          .then((response) => {
            handleClose();
            updateList();
            return response;
          });

        return res;
      } catch (e) {
        console.log('My error', e);
      }
    })();
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.modalOpen && !prevState.dataLoaded) {
      this.getData().then(this.setData);
    }
  }
  render() {
    const { file } = this.props;
    const { dataLoaded } = this.state;
    return (
      <Modal
        open={this.props.modalOpen}
        onClose={this.props.handleClose}
        onOpen={() => alert(4)}
      >
        <Modal.Header>{file.filename}</Modal.Header>
        <Modal.Content image>
          <Image wrapped size="medium" src={file.src} />
          <Modal.Description>
            {dataLoaded ? (
              <List className="file-details" divided relaxed>
                <List.Item>
                  <ListContent>
                    <ListHeader>Key</ListHeader>
                    <ListDescription>{file.Key}</ListDescription>
                  </ListContent>
                </List.Item>
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
                    <Button onClick={this.deleteObject}>Delete File</Button>
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
  }
}
/*
ETag: ""1cfc2a77fcda3db198a19f65a53cc8b4""
Key: "manifest.csv"
LastModified: Tue Jul 14 2020 14:29:29 GMT-0400 (Eastern Daylight Time) {}
Size: 72
StorageClass: "STANDARD"
filename: "manifest.csv"
src: "https://catalanobucket.s3.amazonaws.com/manifest.csv?AWSAccessKeyId=AKIARFXCEQBD4JWEOBSF&Expires=1595356095&Signature=wgmtwL351NE4unHd47kIvTONq0Q%3D"
type: "file"
*/
export default FileDetailsModal;
