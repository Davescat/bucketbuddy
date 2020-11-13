import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import testConnectionS3Bucket from '../../utils/amazon-s3-utils';
import { Button, Form, Message, Dimmer, Loader } from 'semantic-ui-react';
import './connect-to-s3-bucket.scss';

const regions = [
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
];

const ConnectToS3BucketForm = () => {
  const [state, setState] = useState({
    bucketName: process.env.REACT_APP_BUCKET,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_ACCESS_KEY_ID,
    selectedRegion: process.env.REACT_APP_AWS_REGION
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (localStorage.rememberMe) {
      setState({
        bucketName: localStorage.bucketName,
        accessKeyId: localStorage.accessKeyId,
        secretAccessKey: localStorage.secretAccessKey,
        selectedRegion: localStorage.selectedRegion
      });
    }
  }, []);

  const connectToS3Bucket = async ({
    bucketName,
    accessKeyId,
    secretAccessKey,
    region
  }) => {
    try {
      await testConnectionS3Bucket({
        bucketName,
        accessKeyId,
        secretAccessKey,
        region
      });
      history.push(
        {
          pathname: `/bucket-viewer/${encodeURIComponent(bucketName)}`
        },
        {
          bucket: { accessKeyId, secretAccessKey, region, name: bucketName }
        }
      );
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleS3BucketSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    if (rememberMe) {
      localStorage.bucketName = state.bucketName;
      localStorage.accessKeyId = state.accessKeyId;
      localStorage.secretAccessKey = state.secretAccessKey;
      localStorage.selectedRegion = state.selectedRegion;
    } else {
      localStorage.bucketName = '';
      localStorage.accessKeyId = '';
      localStorage.secretAccessKey = '';
      localStorage.selectedRegion = '';
    }
    localStorage.rememberMe = rememberMe;

    connectToS3Bucket({
      bucketName: state.bucketName,
      accessKeyId: state.accessKeyId,
      secretAccessKey: state.secretAccessKey,
      selectedRegion: state.selectedRegion
    });
  };

  const handleFieldChange = (event, { name, value }) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRememberMeCheck = (event) => {
    setRememberMe(!rememberMe);
  };

  return (
    <>
      <Dimmer active={loading}>
        <Loader indeterminate>Trying to connect to your S3 Bucket</Loader>
      </Dimmer>
      <Message className="s3-message">
        <Message.Header>Connect to S3 Bucket</Message.Header>
        {error == null ? (
          <p>Enter your S3 connection credentials below</p>
        ) : (
          <p className="error-message">{error}</p>
        )}
      </Message>
      <Form
        className="s3-form"
        onSubmit={handleS3BucketSubmit}
        error={error != null}
      >
        <Form.Input
          required
          id="form-input-s3-bucket-name"
          name="bucketName"
          label="S3 Bucket Name"
          placeholder="my-really-cool-s3-bucket-name"
          value={state.bucketName}
          onChange={handleFieldChange}
        />
        <Form.Input
          required
          id="form-control-access-key-id"
          name="accessKeyId"
          label="Access Key ID"
          placeholder="12345ABCDEFG"
          value={state.accessKeyId}
          type="password"
          onChange={handleFieldChange}
        />
        <Form.Input
          required
          id="form-control-secret-access-key-id"
          name="secretAccessKey"
          label="Secret Access Key"
          placeholder="12345ABCDEFG/B123232"
          value={state.secretAccessKey}
          type="password"
          onChange={handleFieldChange}
        />
        <Form.Select
          required
          name="selectedRegion"
          value={state.selectedRegion}
          options={regions}
          label={{
            children: 'Region',
            htmlFor: 'form-select-control-region'
          }}
          placeholder="Region"
          search
          searchInput={{
            id: 'form-select-control-region'
          }}
          onChange={handleFieldChange}
        />
        <Form.Checkbox
          label="Remember me"
          checked={rememberMe}
          onChange={handleRememberMeCheck}
        />
        <Button type="submit" primary>
          Connect
        </Button>
      </Form>
    </>
  );
};
export default withRouter(ConnectToS3BucketForm);
