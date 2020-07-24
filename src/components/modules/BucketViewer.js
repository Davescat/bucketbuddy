import React, { Component } from 'react';
import AWS from 'aws-sdk';
import { withRouter } from 'react-router-dom';
import BucketPath from './BucketPath';
import BucketSettings from './BucketSettings';
import FileContainer from './FileContainer';
import { Dimmer, Loader } from 'semantic-ui-react';

export class BucketViewer extends Component {
  state = {
    //Contains Bucket info and starting path information
    ...this.props.location.state,
    pathInfo: { path: '', depth: 0 },
    files: {
      folders: [],
      files: []
    },
    settings: {
      loadMetadata: true,
      loadTags: false,
      loadImages: true
    },
    loading: true
  };

  componentDidMount() {
    this.updateList();
  }

  handleSettingsChange = (newSettings) => {
    this.setState({ settings: newSettings });
  };

  updatePath = (newPath) => {
    const { history } = this.props;
    const { bucket } = this.props.location.state;
    this.setState(
      (prevState) => ({ ...prevState, pathInfo: newPath }),
      () => {
        history.replace(
          {
            pathname: `/bucket-viewer/${bucket.name}/${newPath.path}`
          },
          {
            bucket: bucket
          }
        );
        this.updateList();
      }
    );
  };

  updateList = () => {
    this.setState({ loading: true });
    this.listObjects().then(this.filterList);
  };

  listObjects = () => {
    const {
      pathInfo: { path },
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = this.state;
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
          .listObjectsV2({
            Bucket: name,
            Prefix: path
          })
          .promise()
          .then((response) => {
            console.log('Found Objects');
            return response;
          });
        return res;
      } catch (e) {
        console.log('My error', e);
      }
    })();
  };

  /**
   * Filters the response into files and folders
   * @param {AWS.S3.ListObjectsV2Output} response
   */
  filterList = (response) => {
    let depth = this.state.pathInfo.depth + 1;
    let newFolders = response.Contents.filter(
      (x) =>
        x.Key.split('/').length === depth + 1 && x.Key[x.Key.length - 1] === '/'
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
    this.setState((prevState) => ({
      ...prevState,
      loading: false,
      files: {
        folders: newFolders,
        files: newFiles
      }
    }));
  };

  render() {
    const { bucket } = this.props.location.state;
    const { pathInfo, settings, files, loading } = this.state;
    return (
      <div className="bucket-viewer">
        <BucketPath
          bucket={bucket}
          pathInfo={pathInfo}
          pathChange={this.updatePath}
        />
        <BucketSettings
          bucket={bucket}
          pathInfo={pathInfo}
          settings={settings}
          updateList={this.updateList}
          settingsChange={this.handleSettingsChange}
        />
        {loading ? (
          <Dimmer>
            <Loader indeterminate>Preparing Files</Loader>
          </Dimmer>
        ) : (
          <FileContainer
            bucket={bucket}
            files={files}
            updateList={this.updateList}
            pathInfo={pathInfo}
            settings={settings}
            pathChange={this.updatePath}
          />
        )}
      </div>
    );
  }
}
export default withRouter(BucketViewer);
