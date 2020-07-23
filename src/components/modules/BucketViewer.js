import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import BucketPath from './BucketPath';
import BucketSettings from './BucketSettings';
import FileContainer from './FileContainer';

export class BucketViewer extends Component {

  constructor() {
    super()
    this.state = {
      pathInfo: {
        path: "",
        depth: 0
      },
      settings: {
        loadMetadata: true,
        loadTags: false,
        loadImages: true,
      }
    }
    this.updatePath = this.updatePath.bind(this)
    this.handleSettingsChange = this.handleSettingsChange.bind(this)

  }


  handleSettingsChange(newSettings) {
    this.setState({ settings: newSettings })
  }

  updatePath(newPath) {
    const { history } = this.props;
    const { bucket } = this.props.location.state;
    this.setState({ pathInfo: newPath }, () => {
      history.replace(
        {
          pathname: `/bucket-viewer/${bucket.name}/${newPath.path}`
        },
        {
          bucket: bucket
        }
      );
    })
  }
  

  render() {
    const { bucket } = this.props.location.state;
    return (
      <div className="bucket-viewer">
        <BucketPath pathInfo={this.state.pathInfo} pathChange={this.updatePath} />
        <BucketSettings
          bucket={bucket}
          pathInfo={this.state.pathInfo}
          settings={this.state.settings}
          settingsChange={this.handleSettingsChange}
        />
        <FileContainer
          bucket={bucket}
          pathInfo={this.state.pathInfo}
          settings={this.state.settings}
          pathChange={this.updatePath}
        />
      </div>
    );
  }
}

export default withRouter(BucketViewer);
