import React, { Component } from "react";
import { Form, Input, Button, Select, FormGroup } from "semantic-ui-react";
import "../../ConnectToS3Bucket.scss";

class ConnectToS3BucketForm extends Component {
  constructor() {
    super();
    this.state = {
      regions: [
        { key: "us-east-2", text: "US East (Ohio)", value: "us-east-2" },
        { key: "us-east-1", text: "US East (N. Virginia)", value: "us-east-1" },
        {
          key: "us-west-1",
          text: "US West (N. California)",
          value: "us-west-1",
        },
        { key: "us-west-2", text: "US West (Oregon)", value: "us-west-2" },
        { key: "af-south-1", text: "Africa (Cape Town)", value: "af-south-1" },
        {
          key: "ap-east-1",
          text: "Asia Pacific (Hong Kong)",
          value: "ap-east-1",
        },
        {
          key: "ap-northeast-3",
          text: "Asia Pacific (Osaka-Local)",
          value: "ap-northeast-3",
        },
        {
          key: "ap-northeast-2",
          text: "Asia Pacific (Seoul)",
          value: "ap-northeast-2",
        },
        {
          key: "ap-southeast-1",
          text: "Asia Pacific (Singapore)",
          value: "ap-southeast-1",
        },
        {
          key: "ap-southeast-2",
          text: "Asia Pacific (Sydney)",
          value: "ap-southeast-2",
        },
        {
          key: "ap-northeast-1",
          text: "Asia Pacific (Tokyo)",
          value: "ap-northeast-1",
        },
        {
          key: "ca-central-1",
          text: "Canada (Central)",
          value: "ca-central-1",
        },
        { key: "cn-north-1", text: "China (Beijing)", value: "cn-north-1" },
        {
          key: "cn-northwest-1",
          text: "China (Ningxia)",
          value: "cn-northwest-1",
        },
        {
          key: "eu-central-1",
          text: "Europe (Frankfurt)",
          value: "eu-central-1",
        },
        { key: "eu-west-1", text: "Europe (Ireland)", value: "eu-west-1" },
        { key: "eu-west-2", text: "Europe (London)", value: "eu-west-2" },
        { key: "eu-south-1", text: "Europe (Milan)", value: "eu-south-1" },
        { key: "eu-west-3", text: "Europe (Paris)", value: "eu-west-3" },
        { key: "eu-north-1", text: "Europe (Stockholm)", value: "eu-north-1" },
        {
          key: "sa-east-1",
          text: "South America (São Paulo)",
          value: "sa-east-1",
        },
      ],
    };
  }

  connectToS3Bucket(bucketName, accessKeyId, secretAccessKey, region) {}

  render() {
    return (
      <Form className="s3-form">
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
        <Button type="submit" primary>
          Connect
        </Button>
      </Form>
    );
  }
}

export default ConnectToS3BucketForm;
