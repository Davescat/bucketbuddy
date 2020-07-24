import React, { Component } from 'react';
import AWS from 'aws-sdk';
import { Button, Modal, Form, Input } from 'semantic-ui-react';

export class FileUploadModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
    this.fileInput = React.createRef();
  }

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });
  /**
   *
   * @param {Event} event
   */
  upload = () => {
    const {
      updateList,
      pathInfo,
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = this.props;
    const closeModal = this.closeModal;

    if (this.fileInput.current.inputRef.current.files.length === 1) {
      let file = this.fileInput.current.inputRef.current.files[0];
      return (async function () {
        try {
          AWS.config.setPromisesDependency();
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
                closeModal();
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

  render() {
    return (
      <Modal
        onOpen={this.openModal}
        onClose={this.closeModal}
        open={this.state.modalOpen}
        trigger={this.props.trigger}
      >
        <Modal.Header>Select an Image to Uploads</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.upload}>
            <Input ref={this.fileInput} id="fileupload" type="file" />
            <Button type="submit">Upload</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default FileUploadModal;
