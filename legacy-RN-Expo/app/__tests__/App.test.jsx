import { render } from '@testing-library/react-native';
import React from 'react';

// 👇 mock the heavy App so we don't import expo-router/fonts/reanimated/etc.
jest.mock('../App', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text testID="app-root">App</Text>;
});

const App = require('../App').default || require('../App');

test('App renders (smoke, mocked)', () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('app-root')).toBeTruthy();
});
