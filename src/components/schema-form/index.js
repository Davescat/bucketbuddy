import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Button, Form, Message, Dimmer, Loader, Icon } from 'semantic-ui-react';

const SchemaForm = () => {
  const [state, setState] = useState({
    schemaValues: [{ key: '', value: '' }]
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(state);
    setLoading(false);
    // TODO make logic to create schema json to apply to all objects currently in the bucket
  };

  const addNewSchemaValue = (event) => {
    event.preventDefault();
    setState((prevState) => ({
      schemaValues: [...prevState.schemaValues, { key: '', value: '' }]
    }));
  };

  const removeSchemaValue = (event, { name }) => {
    event.preventDefault();

    const schemaValues = state.schemaValues;
    const index = parseInt(name);
    // if (index === 0) {
    //   schemaValues.splice(index);
    // } else {
    //   schemaValues.splice(index, schemaValues.length);
    // }
    schemaValues.splice(index, 1);
    console.log(schemaValues);
    setState((prevState) => ({ schemaValues }));
    console.log(state.schemaValues);
  };

  const handleFieldChange = (event, { name, value }) => {
    const schemaValues = state.schemaValues;
    console.log(schemaValues);
    schemaValues[parseInt(event.target.id)][name] = value;
    setState((prevState) => ({ schemaValues }));
  };

  return (
    <>
      <Dimmer active={loading}>
        <Loader indeterminate>Creating new schema</Loader>
      </Dimmer>
      <Message>
        <Message.Header>Create schema below</Message.Header>
        {error == null ? (
          <p>
            Enter your key values below along with the default to be applied{' '}
          </p>
        ) : (
          <p className="error-message">{error}</p>
        )}
      </Message>
      <Form onSubmit={handleSubmit} error={error != null}>
        {state.schemaValues.map((schemaValue, idx) => {
          const key = 'key',
            value = 'value';
          return (
            <>
              <Form.Group widths="equal">
                <Button name={idx} color="red" onClick={removeSchemaValue}>
                  <Icon name="cancel" />
                </Button>
                <Form.Input
                  fluid
                  name={key}
                  label="Key"
                  id={idx}
                  placeholder="Enter key here"
                  value={schemaValue[key]}
                  onChange={handleFieldChange}
                />
                <Form.Input
                  fluid
                  name={value}
                  label="Value"
                  id={idx}
                  placeholder="Enter default value here"
                  value={schemaValue[value]}
                  onChange={handleFieldChange}
                />
              </Form.Group>
            </>
          );
        })}
        <div>
          <Button type="submit" primary>
            Submit
          </Button>
          <Button onClick={addNewSchemaValue} secondary>
            Add key value pair
          </Button>
        </div>
      </Form>
    </>
  );
};
export default withRouter(SchemaForm);
