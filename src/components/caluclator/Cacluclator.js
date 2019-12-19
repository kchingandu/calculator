import React, { useEffect, useRef } from 'react';
import { buttonData } from './support/buttonData';

const Calculator = ({displayText = '0'}) => {
  const inputRef = useRef();

  useEffect(() => void (inputRef.current.scrollLeft = inputRef.current.scrollWidth), [displayText]);

  return (
    <div id="calculator">
      <input
        dir="ltr"
        id="display"
        ref={inputRef}
        onChange={Function.prototype}
        value={displayText.length ? displayText : 0}/>
      {
        buttonData.map(({displayName, value}) => (
          <button
            key={displayName}
            className="calculator-button"
          >
            {value}
          </button>
        ))
      }
      <button
        id="clear"
        type='button'
        className="calculator-button"
      >
        c
      </button>
    </div>
  )
};

export default Calculator;
