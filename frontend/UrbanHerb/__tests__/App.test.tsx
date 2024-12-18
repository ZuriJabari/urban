/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it, expect, describe} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('App Component', () => {
  it('renders correctly', () => {
    renderer.create(<App />);
  });

  it('App component exists', () => {
    expect(App).toBeDefined();
  });

  it('App component is a valid React component', () => {
    const tree = renderer.create(<App />);
    expect(tree.toJSON()).toBeTruthy();
  });
});
