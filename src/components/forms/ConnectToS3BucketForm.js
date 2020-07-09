import React, { Component } from "react";
import { Form, Input, Button, Select } from "semantic-ui-react";

class ConnectToS3BucketForm extends Component {
  constructor() {
    super();
    this.state = {
      regions: [
        { key: "us-east-2", text: "US East (Ohio)", value: "us-east-2" },
        { key: "us-east-1", text: "US East (N. Virginia)", value: "us-east-1" },
      ],
    };
  }

  render() {
    return (
      <Form>
        <Form.Field
          id="form-input-s3-bucket-name"
          control={Input}
          label="S3 Bucket Name"
          placeholder="my-really-cool-s3-bucket-name"
        />
        <Form.Field
          id="form-control-access-key-id"
          control={Input}
          label="Access Key ID"
          placeholder="12345ABCDEFG"
        />
        <Form.Field
          id="form-control-access-key-id"
          control={Input}
          label="Secret Access Key"
          placeholder="12345ABCDEFG/B123232"
        />
        <Form.Field
          control={Select}
          options={this.state.regions}
          label={{ children: "Region", htmlFor: "form-select-control-region" }}
          placeholder="Region"
          search
          searchInput={{ id: "form-select-control-region" }}
        />
        <Form.Field
          id="form-button-control-connect"
          control={Button}
          content="Connect"
        />
      </Form>
    );
  }
}

export default ConnectToS3BucketForm;
