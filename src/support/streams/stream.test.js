import { getClickAndKeyDown$, getOnClick$, getOnKeyDown$ } from './streams';
import { getProcessingFunctionForKey, handleEquals, mapOperatorToDisplayMap } from '../utils/utils';

jest.mock('../utils/utils', () => ({
  mapOperatorToDisplayMap: jest.fn(key => key),
  getProcessingFunctionForKey: jest.fn()
}));

describe('streams', () => {
  let eventSimulator;

  let mockDocument;

  beforeEach(() => {
    eventSimulator = {};

    mockDocument = {
      removeEventListener: Function.prototype,
      addEventListener: (event, handler) => eventSimulator[event] = handler
    }
  });

  describe('click stream', () => {
    let click$;

    let clickEvent;

    let subscriptionHandler;

    beforeEach(() => {
      subscriptionHandler = jest.fn();

      click$ = getOnClick$(mockDocument);

      click$.subscribe(subscriptionHandler);

      clickEvent = {
        target: {textContent: 'x', className: 'calculator-button'}
      };
    });

    it('should handle/filter through explicitly calculator button click events', () => {
      eventSimulator.click(clickEvent);

      expect(subscriptionHandler).toHaveBeenCalledWith('x');
    });

    it('should not update subscriber for any other click target', () => {
      clickEvent.target.className = 'some-other-element';

      eventSimulator.click(clickEvent);

      expect(subscriptionHandler).not.toHaveBeenCalled();
    });
  });

  describe('keydown stream', () => {
    let onKeydown$;
    let keydownEvent;
    let subscriptionHandler;

    beforeEach(() => {
      subscriptionHandler = jest.fn();

      onKeydown$ = getOnKeyDown$(mockDocument);

      onKeydown$.subscribe(subscriptionHandler);

      keydownEvent = {key: '9'}
    });

    it('should handle/filter through explicitly numeric inputs', () => {
      assertInputsUpdateSubscriber(['1', '2', '3', '4', '5', '6', '8', '9', '10']);
    });

    it('should handle/filter through math operators', () => {
      assertInputsUpdateSubscriber(['/', 'x', '+', '-', '*', '.']);
    });

    it('should handle/filter through subset of keyboard inputs', () => {
      assertInputsUpdateSubscriber(['Backspace', 'Enter', 'c']);
    });

    it('should not update subscriber for any other keyboard inputs', () => {
      ['a', '<', ']', '!', '%'].forEach((input) => {
        keydownEvent.key = input;

        eventSimulator.keydown(keydownEvent);

        expect(subscriptionHandler).not.toHaveBeenCalledWith(input);
      })
    });

    it('should map certain inputs to their display equivalents e.g. / is mapped to ÷ ', () => {
      keydownEvent.key = '/';

      eventSimulator.keydown(keydownEvent);

      expect(mapOperatorToDisplayMap).toHaveBeenCalledWith('/')
    });

    const assertInputsUpdateSubscriber = (inputs) => {
      inputs.forEach((input) => {
        keydownEvent.key = input;

        eventSimulator.keydown(keydownEvent);

        expect(subscriptionHandler).toHaveBeenCalledWith(input);
      });
    };
  });

  describe('clickAndKeydown stream', () => {
    let clickEvent;
    let keydownEvent;
    let clickAndKeydown$;
    let subscriptionHandler;

    beforeEach(() => {
      subscriptionHandler = jest.fn();

      clickAndKeydown$ = getClickAndKeyDown$(mockDocument);

      clickAndKeydown$.subscribe(subscriptionHandler);

      keydownEvent = {key: '9'};

      clickEvent = {
        target: {textContent: 'x', className: 'calculator-button'}
      };
    });

    it('should handle update the subscriber with accumulated inputs from the click and keydown streams ', () => {
      getProcessingFunctionForKey.mockReturnValueOnce((acc) => acc + '9');

      getProcessingFunctionForKey.mockReturnValueOnce((acc) => acc + 'x');

      eventSimulator.keydown(keydownEvent);

      eventSimulator.click(clickEvent);

      expect(subscriptionHandler).toHaveBeenCalledWith('9');
      expect(subscriptionHandler).toHaveBeenCalledWith('9x');
    });

    it('should not update the subscriber when stream returns the same value', () => {
      getProcessingFunctionForKey.mockReturnValueOnce(() => '9');

      getProcessingFunctionForKey.mockReturnValueOnce(() => '9');

      eventSimulator.keydown(keydownEvent);

      eventSimulator.click(clickEvent);

      expect(subscriptionHandler).toHaveBeenCalledWith('9');
      expect(subscriptionHandler).toHaveBeenCalledTimes(1);
    });

    describe('errorHandling', () => {
      it('should catch errors and display appropriate message ', () => {
        getProcessingFunctionForKey.mockReturnValueOnce(handleEquals);

        eventSimulator.click(clickEvent);

        expect(subscriptionHandler).toHaveBeenCalledWith('Bad Expression');
      });

      it('should still be able continue to processing events after handling error', () => {
        getProcessingFunctionForKey.mockReturnValueOnce(handleEquals);

        eventSimulator.click(clickEvent);

        getProcessingFunctionForKey.mockReturnValueOnce((acc) => acc + '9');

        eventSimulator.keydown(keydownEvent);

        expect(subscriptionHandler).toHaveBeenCalledWith('9');
      });
    });
  });
});