import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

test('renders Item Viewer heading', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const headingElement = screen.getByText(/Item Viewer/i);
  expect(headingElement).toBeInTheDocument();
});
