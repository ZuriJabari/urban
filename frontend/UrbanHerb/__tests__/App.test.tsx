/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it, expect, describe, beforeEach} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('App Component', () => {
  let component: renderer.ReactTestRenderer;

  beforeEach(() => {
    component = renderer.create(<App />);
  });

  it('renders correctly', () => {
    expect(component).toBeDefined();
  });

  it('App component exists', () => {
    expect(App).toBeDefined();
  });

  it('App component is a valid React component', () => {
    expect(component.toJSON()).toBeTruthy();
  });

  it('matches snapshot', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('has a valid root element', () => {
    const root = component.root;
    expect(root).toBeTruthy();
    expect(root.type).toBe(App);
  });
});
