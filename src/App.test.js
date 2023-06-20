import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders the page header', () => {
  const { getByText } = render(<App />);
  const header = getByText('Connect to S3 Bucket');
  expect(header).toBeInTheDocument();
});
