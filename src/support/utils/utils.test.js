import { handleBackSpace, handleCancel, handleDecimal, handleEquals, handleOperator } from './utils'

describe('utils', () => {
  describe('handleOperator', () => {
    it('should not add the operator when there is no accumulated value', () => {
      const result = handleOperator('x')('');
      expect(result).toEqual('');
    });

    it('should not add minus operator even if there is no accumulated value', () => {
      const result = handleOperator('-')('');
      expect(result).toEqual('-');
    });

    it('should replace the add operator at the end of the accumulated value ', () => {
      const result = handleOperator('-')('12+');

      expect(result).toEqual('12-');
    });

    it('should replace the division operator at the end of the accumulated value ', () => {
      const result = handleOperator('x')('12÷');

      expect(result).toEqual('12x');
    });

    it('should replace multiply operator at the end of the accumulated value ', () => {
      const result = handleOperator('-')('12x');

      expect(result).toEqual('12-');
    });

    it('should not add the minus operator when the end of the accumulated value', () => {
      const result = handleOperator('-')('12-');

      expect(result).toEqual('12-');
    });
  });

  describe('handlingDecimal', () => {
    it('should add a decimal to the end of the accumulated value', () => {
      const result = handleDecimal('.')('12');

      expect(result).toEqual('12.')
    });

    it('should not add a decimal if the accumulated value already contains a decimal', () => {
      const result = handleDecimal('.')('12.2');

      expect(result).toEqual('12.2')
    });

    it('should add a decimal when the accumulated value has an operator between the previous decimal', () => {
      const result = handleDecimal('.')('12.2x1');

      expect(result).toEqual('12.2x1.')
    });
  });

  describe('handlingBackspace', () => {
    it('should remove the last character in the accumulated value', () => {
      const result = handleBackSpace()('1.2');

      expect(result).toEqual('1.')
    });
  });

  describe('handlingCancel', () => {
    it('should set the accumulated value to a blank string', () => {
      const result = handleCancel()('1.2');

      expect(result).toEqual('')
    });
  });

  describe('handleEquals', () => {
    it('should calculate the answer from a string containing numbers and display operators', () => {
      const result = handleEquals()('1+2x10÷7');

      expect(result).toEqual('3.857142857142857')
    });
  });
});