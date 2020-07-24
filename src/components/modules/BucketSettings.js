import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import FileUploadModal from '../modals/FileUploadModal';

/**
 * This component controls how much info you want to load in from the api
 */
export class BucketSettings extends Component {
  state = this.props.settings;

  changeSetting = (setting) => {
    this.setState(
      {
        [setting]: !this.state[setting]
      },
      () => this.props.settingsChange(this.state)
    );
  };
  render() {
    const { updateList, bucket, pathInfo } = this.props;
    return (
      <div className="bucket-bar">
        <span className="bucket-settings"></span>
        <span className="bucket-buttons">
          <FileUploadModal
            updateList={updateList}
            bucket={bucket}
            pathInfo={pathInfo}
            trigger={<Button size="medium">Upload</Button>}
          />
        </span>
      </div>
    );
  }
}

export default BucketSettings;
