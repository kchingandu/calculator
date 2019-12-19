import React from 'react';
import { mount } from 'enzyme';
import Calculator from './Cacluclator';

describe('calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = mount(<Calculator/>);
  });

  it('should render the display input field and numeric and operator buttons', () => {
    expect(calculator.html()).toMatchSnapshot();
  });

  it('should update the input field from props', () => {
    calculator.setProps({displayText: '1.2x1.2'});

    expect(calculator.find('[id="display"]').props().value).toEqual('1.2x1.2');
  });

  it('should update the scroll position of the input field to always show right most text', () => {
    const displayInput = calculator.find('[id="display"]').getDOMNode();

    Object.defineProperty(displayInput, 'scrollWidth', {get: () => 316});

    calculator.setProps({displayText: '123'});

    expect(displayInput.scrollLeft).toEqual(316);
  });
})
;