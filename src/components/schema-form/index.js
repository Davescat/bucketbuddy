import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
  Button,
  Form,
  Message,
  Dimmer,
  Loader,
  Icon,
  Label
} from 'semantic-ui-react';

import './SchemaForm.scss';

const SchemaForm = (props) => {
  const issueSubmittingError =
    'Hmm... There was an error submitting the form. Please verify your inputs and try again or enter a ticket on our repo.';

  const duplicateError =
    'You have duplicate field names. Please verify you have no field names that are the same!';

  const [state, setState] = useState({
    schemaValues: props.schemaValues
      ? props.schemaValues
      : [{ key: '', value: '' }]
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const checkIfDuplicateKeys = (schemaValues) => {
    for (let field in schemaValues) {
      let count = 1;

      for (let innerField in schemaValues) {
        if (innerField['key'] === field['key']) {
          count++;
        }
      }
      if (count >= 2) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    if (checkIfDuplicateKeys(state.schemaValues)) {
      setError(duplicateError);
    } else {
      try {
        props.actionOnSubmit(state.schemaValues);
      } catch (e) {
        setError(issueSubmittingError);
      }
    }

    setLoading(false);
    history.push({
      pathname: '/bucket-viewer'
    });
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
    schemaValues.splice(index, 1);
    console.log(schemaValues);
    setState((prevState) => ({ schemaValues }));
  };

  const handleFieldChange = (event, { name, value }) => {
    const schemaValues = state.schemaValues;
    schemaValues[parseInt(event.target.id)][name] = value;
    setState((prevState) => ({ schemaValues }));
  };

  return (
    <div className="schema-form">
      <Dimmer active={loading}>
        <Loader indeterminate>Processing ...</Loader>
      </Dimmer>
      <Message>
        <Message.Header>{props.title}</Message.Header>
        {error == null ? (
          <p>Enter your field names and field inputs to be applied </p>
        ) : (
          <p className="error-message">{error}</p>
        )}
      </Message>
      <Form onSubmit={handleSubmit}>
        {state.schemaValues.map((schemaValue, idx) => {
          const key = 'key',
            value = 'value';
          return (
            <>
              <Form.Group widths="equal" className="field-row">
                <Button
                  fluid
                  name={idx}
                  color="red"
                  className="button-fit-content"
                  onClick={removeSchemaValue}
                >
                  <Icon name="cancel" />
                </Button>
                {props.editFieldName ? (
                  <Form.Input
                    fluid
                    name={key}
                    label="Field Name"
                    id={idx}
                    required
                    placeholder="Enter field name here"
                    value={schemaValue[key]}
                    onChange={handleFieldChange}
                  />
                ) : (
                  <Label>{schemaValue[key]}</Label>
                )}
                <Form.Input
                  fluid
                  name={value}
                  label="Field Input"
                  id={idx}
                  required
                  placeholder="Enter field input here"
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
          {props.editFieldName ? (
            <Button onClick={addNewSchemaValue} secondary>
              Add field
            </Button>
          ) : (
            ''
          )}
        </div>
      </Form>
    </div>
  );
};
export default withRouter(SchemaForm);
