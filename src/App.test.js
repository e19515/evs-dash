import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

import { render, screen } from '@testing-library/react';
import App from './App';

it('renders EVS dashboard', () => {
  render(<App />);
  const h1Element = screen.getByText(/EVS dashboard/i);
  expect(h1Element).toBeInTheDocument();
});
