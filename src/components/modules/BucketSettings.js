import React, { Component } from 'react'
import { Radio } from 'semantic-ui-react'

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
            <div className="bucket-settings">
            <span><Radio toggle name="loadTags" checked={this.state.loadTags} label="Load Tags" onChange={() => this.changeSetting('loadTags')} /></span>
            <span><Radio toggle name="loadImages" checked={this.state.loadImages} label="Load Images" onChange={() => this.changeSetting('loadImages')} /></span>
            <span><Radio toggle name="loadMetadata" checked={this.state.loadMetadata} label="Load Versions" onChange={() => this.changeSetting('loadMetadata')} /></span>
            </div>
        )
    }
}

export default BucketSettings
