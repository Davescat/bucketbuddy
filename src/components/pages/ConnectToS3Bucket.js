import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import ConnectToS3BucketForm from "../forms/ConnectToS3BucketForm";

class ConnectToS3Bucket extends Component {
  render() {
    return (
      <div>
        <ConnectToS3BucketForm />
      </div>
    );
  }
}

export default withRouter(ConnectToS3Bucket);
