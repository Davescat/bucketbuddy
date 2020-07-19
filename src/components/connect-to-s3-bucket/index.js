import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import './ConnectToS3Bucket.scss';

class ConnectToS3BucketForm extends Component {
  constructor() {
    super();
    this.state = {
      bucketName: '',
      accessKeyId: '',
      secretAccessKey: '',
      selectedRegion: '',
      formError: false,
      errorMessage:
        //TODO make message more specific
        'Hmm.. We were unable to connect to the S3 bucket with the credentials you provided please try again.',

      regions: [
        { key: 'us-east-2', text: 'US East (Ohio)', value: 'us-east-2' },
        { key: 'us-east-1', text: 'US East (N. Virginia)', value: 'us-east-1' },
        {
          key: 'us-west-1',
          text: 'US West (N. California)',
          value: 'us-west-1'
        },
        { key: 'us-west-2', text: 'US West (Oregon)', value: 'us-west-2' },
        { key: 'af-south-1', text: 'Africa (Cape Town)', value: 'af-south-1' },
        {
          key: 'ap-east-1',
          text: 'Asia Pacific (Hong Kong)',
          value: 'ap-east-1'
        },
        {
          key: 'ap-northeast-3',
          text: 'Asia Pacific (Osaka-Local)',
          value: 'ap-northeast-3'
        },
        {
          key: 'ap-northeast-2',
          text: 'Asia Pacific (Seoul)',
          value: 'ap-northeast-2'
        },
        {
          key: 'ap-southeast-1',
          text: 'Asia Pacific (Singapore)',
          value: 'ap-southeast-1'
        },
        {
          key: 'ap-southeast-2',
          text: 'Asia Pacific (Sydney)',
          value: 'ap-southeast-2'
        },
        {
          key: 'ap-northeast-1',
          text: 'Asia Pacific (Tokyo)',
          value: 'ap-northeast-1'
        },
        {
          key: 'ca-central-1',
          text: 'Canada (Central)',
          value: 'ca-central-1'
        },
        { key: 'cn-north-1', text: 'China (Beijing)', value: 'cn-north-1' },
        {
          key: 'cn-northwest-1',
          text: 'China (Ningxia)',
          value: 'cn-northwest-1'
        },
        {
          key: 'eu-central-1',
          text: 'Europe (Frankfurt)',
          value: 'eu-central-1'
        },
        { key: 'eu-west-1', text: 'Europe (Ireland)', value: 'eu-west-1' },
        { key: 'eu-west-2', text: 'Europe (London)', value: 'eu-west-2' },
        { key: 'eu-south-1', text: 'Europe (Milan)', value: 'eu-south-1' },
        { key: 'eu-west-3', text: 'Europe (Paris)', value: 'eu-west-3' },
        { key: 'eu-north-1', text: 'Europe (Stockholm)', value: 'eu-north-1' },
        {
          key: 'sa-east-1',
          text: 'South America (São Paulo)',
          value: 'sa-east-1'
        }
      ]
    };

    this.connectToS3Bucket = this.connectToS3Bucket.bind(this);
    this.handleS3BucketSubmit = this.handleS3BucketSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  connectToS3Bucket(bucketName, accessKeyId, secretAccessKey, region) {
    const AWS = require('aws-sdk');
    const { history } = this.props;
    const { setState } = this;

    AWS.config.setPromisesDependency();
    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region
    });
    const s3Instance = new AWS.S3();

    const params = {
      Bucket: bucketName
    };
    //TODO instead of passing the variable pass the instance but currently throws error
    const state = {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
      bucketName: bucketName
    };
    s3Instance.headBucket(params, function (error, data) {
      if (error) {
        setState({ formError: true });
      } else {
        history.push({
          pathname: '/bucket-viewer',
          state
        });
      }
    });
  }

  handleS3BucketSubmit(event) {
    event.preventDefault();
    this.connectToS3Bucket(
      this.state.bucketName,
      this.state.accessKeyId,
      this.state.secretAccessKey,
      this.state.selectedRegion
    );
  }

  handleFieldChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    const {
      bucketName,
      accessKeyId,
      secretAccessKey,
      formError,
      errorMessage
    } = this.state;

    return (
      <>
        <Message className="s3-message">
          <Message.Header>Connect to S3 Bucket</Message.Header>
          {formError ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
            <p>Enter your S3 connection credentials below</p>
          )}
        </Message>
        <Form
          className="s3-form"
          onSubmit={this.handleS3BucketSubmit}
          error={this.state.formError}
        >
          <Form.Input
            id="form-input-s3-bucket-name"
            name="bucketName"
            label="S3 Bucket Name"
            placeholder="my-really-cool-s3-bucket-name"
            value={bucketName}
            onChange={this.handleFieldChange}
          />
          <Form.Input
            id="form-control-access-key-id"
            name="accessKeyId"
            label="Access Key ID"
            placeholder="12345ABCDEFG"
            value={accessKeyId}
            type="password"
            onChange={this.handleFieldChange}
          />
          <Form.Input
            id="form-control-secret-access-key-id"
            name="secretAccessKey"
            label="Secret Access Key"
            placeholder="12345ABCDEFG/B123232"
            value={secretAccessKey}
            type="password"
            onChange={this.handleFieldChange}
          />
          <Form.Select
            name="selectedRegion"
            options={this.state.regions}
            label={{
              children: 'Region',
              htmlFor: 'form-select-control-region'
            }}
            placeholder="Region"
            search
            searchInput={{
              id: 'form-select-control-region'
            }}
            onChange={this.handleFieldChange}
          />
          <Button type="submit" primary>
            Connect
          </Button>
        </Form>
      </>
    );
  }
}

export default withRouter(ConnectToS3BucketForm);
