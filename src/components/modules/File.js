import AWS from 'aws-sdk';
import React, { Component } from 'react';
import { Card, Image, Placeholder } from 'semantic-ui-react';
import FileDetailsModal from '../modals/FileDetailsModal';

export class File extends Component {
  constructor() {
    super();
    this.state = {
      imageLoaded: false,
      src: '',
      modalOpen: false
    };
  }

  getData = () => {
    const {
      file: { Key },
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = this.props;

    return (async function (key) {
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
    })(Key);
  };

  /**
   * Turns the UInt8Aray into a base64 encoded string as the source for the displayable image
   * @param {S3.GetObjectOutput} data
   */
  encode = (data) => {
    var str = data.Body.reduce(function (a, b) {
      return a + String.fromCharCode(b);
    }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  };

  getImageUrl = () => {
    const {
      file: { Key },
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
        const url = await s3.getSignedUrlPromise('getObject', {
          Bucket: name,
          Key: Key
        });
        return url;
      } catch (e) {
        console.log('My error', e);
      }
    })();
  };

  componentDidMount() {
    if (this.props.file.type === 'file') {
      this.getImageUrl().then((data) => {
        this.setState({
          imageLoaded: true,
          src: data
        });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.file.Key !== this.props.file.Key) {
      this.getImageUrl().then((data) => {
        this.setState({
          imageLoaded: true,
          src: data
        });
      });
    }
  }

  /**
   * Gets the appropriate tags for whatever type of file requested
   */
  getImage() {
    if (this.props.settings.loadImages) {
      if (this.props.file.type === 'file') {
        if (this.state.imageLoaded) {
          return <Image src={this.state.src} wrapped ui={false} />;
        } else {
          return (
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>
          );
        }
      }
    } else {
      if (this.props.file.type === 'file') {
        return (
          <Image
            src="https://react.semantic-ui.com/images/wireframe/square-image.png"
            wrapped
            ui={false}
          />
        );
      }
    }
  }

  handleFileClick = () => {
    const { file, customClickEvent } = this.props;
    if (file.type === 'folder') {
      let newDepth = file.Key.split('/').length - 1;
      let newPathInfo = {
        path: file.Key,
        depth: newDepth
      };
      customClickEvent(newPathInfo);
    } else if (file.type === 'file') {
      this.setState({ modalOpen: true });
    }
  };

  render() {
    const { file, bucket } = this.props;
    let keys = file.Key.split('/');
    let filename = '';
    if (file.type === 'file') {
      filename = keys.length === 1 ? keys[0] : keys[keys.length - 1];
    } else {
      filename = keys.length === 1 ? keys[0] : keys[keys.length - 2] + '/';
    }
    return [
      <Card className="file-card" onClick={this.handleFileClick}>
        {this.getImage()}
        <Card.Content>
          <Card.Header>{filename}</Card.Header>
          <Card.Meta>{`Last modified: ${file.LastModified}`}</Card.Meta>
          <Card.Meta>{`Size: ${file.Size} bytes`}</Card.Meta>
        </Card.Content>
      </Card>,
      file.type === 'file' && (
        <FileDetailsModal
          updateList={this.props.updateList}
          bucket={bucket}
          modalOpen={this.state.modalOpen}
          handleClose={() => this.setState({ modalOpen: false })}
          file={{
            ...file,
            filename: filename,
            src: this.state.src
          }}
        />
      )
    ];
  }
}
export default File;
