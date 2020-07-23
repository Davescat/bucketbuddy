import AWS from 'aws-sdk';
import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import File from './File';
import FileDetailsModal from '../modals/FileDetailsModal';

export class FileContainer extends Component {
  state = {
    folders: [],
    files: [],
  };


  listObjects = () => {
    const {
      pathInfo: { path },
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = this.props;

    return (async function (path) {
      try {
        console.log(path);

        AWS.config.setPromisesDependency();
        AWS.config.update({
          accessKeyId,
          secretAccessKey,
          region
        });
        const s3 = new AWS.S3();
        const res = await s3
          .listObjectsV2({
            Bucket: name,
            Prefix: path
          })
          .promise()
          .then((response) => {
            return response;
          });
        return res;
      } catch (e) {
        console.log('My error', e);
      }
    })(path);
  };

  /**
   * 
   * @param {AWS.S3.ListObjectsV2Output} response 
   */
  filterList = (response) => {
    let depth = this.props.pathInfo.depth + 1;
    let newFolders = response.Contents.filter(
      (x) =>
        x.Key.split('/').length === depth + 1 &&
        x.Key[x.Key.length - 1] === '/'
    ).map((folder) => {
      folder.type = 'folder';
      return folder;
    });
    let newFiles = response.Contents.filter(
      (x) =>
        x.Key.split('/').length === depth && x.Key[x.Key.length - 1] !== '/'
    ).map((file) => {
      file.type = 'file';
      return file;
    });
    this.setState({
      folders: newFolders,
      files: newFiles
    });
  }

  componentDidMount() {
    this.listObjects().then(this.filterList)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.pathInfo.path !== this.props.pathInfo.path) {
      this.listObjects().then(this.filterList)
    }
  }

  updateList = () => {
    this.listObjects().then(this.filterList)
  }

  render() {
    const { bucket } = this.props;

    const displayFiles = this.state.folders.concat(this.state.files);
    console.log(displayFiles);
    return (
      <Card.Group className="file-container">
        {displayFiles.map((x, i) =>
          <File
            bucket={bucket}
            key={`file${i}`}
            file={x}
            updateList={this.updateList}
            settings={this.props.settings}
            customClickEvent={this.props.pathChange}
          />
        )}
      </Card.Group>
    );
  }
}

export default FileContainer;
