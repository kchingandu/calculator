import { evaluate } from 'mathjs'

const DIVIDE = '÷';
const operators = ['÷', 'x', '+', '-'];
const operatorDisplayMap = {'/': '÷', '*': 'x', '+': '+', '-': '-', [DIVIDE]: '÷', 'x': 'x'};

export const handleValue = (currentValue) => (accumulatedValues) => accumulatedValues + currentValue;

export const handleDecimal = () => (accumulatedValues) => (
  accumulatedValues.replace(/[\d]/gi, '').endsWith('.')
    ? accumulatedValues
    : accumulatedValues + '.'
);

export const handleOperator = (currentValue) => (accumulatedValues) => {
  const currentOperator = operatorDisplayMap[currentValue];

  const charAtEnd = accumulatedValues[accumulatedValues.length - 1];

  if (currentOperator === charAtEnd || (currentOperator !== '-' && !accumulatedValues.length)) {
    return accumulatedValues;
  }

  if (operators.includes(charAtEnd)) {
    return accumulatedValues.slice(0, -1) + currentOperator;
  }
  return accumulatedValues + currentValue;
};

export const handleBackSpace = () => (accumulatedValues = '') => accumulatedValues.slice(0, -1);

export const handleCancel = () => () => '';

export const handleEquals = () => (accumulatedValues = '') => {
  return evaluate(accumulatedValues.replace(/÷/g, '/').replace(/x/g, '*')).toString();
};

const processingFunctionMaps = {
  'c': handleCancel,
  '=': handleEquals,
  '.': handleDecimal,
  '+': handleOperator,
  'x': handleOperator,
  '-': handleOperator,
  '*': handleOperator,
  'Enter': handleEquals,
  [DIVIDE]: handleOperator,
  'Backspace': handleBackSpace,
};

export const getProcessingFunctionForKey = (key) => processingFunctionMaps[key] ? processingFunctionMaps[key](key) : handleValue(key);

export const mapOperatorToDisplayMap = (key) => {
  switch (key) {
    case '*':
      return 'x';
    case '/':
      return DIVIDE;
    default:
      return key;
  }
};