import App from './App';
import React from 'react';
import { mount } from 'enzyme';

describe('App', () => {
  let app;

  beforeEach(() => {
    app = mount(<App/>);
  });

  it('should render the calculator and info text', () => {
    expect(app.html()).toMatchSnapshot();
  });
});