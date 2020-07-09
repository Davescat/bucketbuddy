import React, { Component } from "react";
import BucketPath from "./BucketPath";
import FileContainer from "./FileContainer";
import BucketSettings from "./BucketSettings";

export class BucketViewer extends Component {
  constructor() {
    super();
    this.state = {
      pathInfo: {
        path: "",
        depth: 0,
      },
      settings: {
        loadMetadata: true,
        loadTags: false,
        loadImages: true,
      },
    };
    this.updatePath = this.updatePath.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
  }

  handleSettingsChange(newSettings) {
    this.setState({ settings: newSettings });
  }

  updatePath(newPath) {
    this.setState({ pathInfo: newPath });
  }

  render() {
    console.log(this.state);
    return (
      <div className="bucket-viewer">
        <BucketPath pathInfo={this.state.pathInfo} />
        <BucketSettings
          settings={this.state.settings}
          settingsChange={this.handleSettingsChange}
        />
        <FileContainer
          pathInfo={this.state.pathInfo}
          settings={this.state.settings}
          pathChange={this.updatePath}
        />
      </div>
    );
  }
}

export default BucketViewer;
