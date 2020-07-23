import React, { Component } from 'react'
import { Radio, Button } from 'semantic-ui-react'
import FileUploadModal from '../modals/FileUploadModal'

/**
 * This component controls how much info you want to load in from the api
 */
export class BucketSettings extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.settings
    this.changeSetting = this.changeSetting.bind(this)
  }

  changeSetting(setting) {
    this.setState({
      [setting]: !this.state[setting]
    },
      () => this.props.settingsChange(this.state));

  }
  render() {
    return (
      <div className="bucket-bar">
        <span className="bucket-settings">
        </span>
      <span className='bucket-buttons'>
        <FileUploadModal bucket={this.props.bucket} pathInfo={this.props.pathInfo} trigger={<Button size='medium' >Upload</Button>} />
      </span>
            </div >
        )
  }
}

export default BucketSettings;
