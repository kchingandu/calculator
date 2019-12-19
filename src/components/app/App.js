import React, { useState, useEffect } from 'react';
import './App.css';
import Calculator from '../caluclator/Cacluclator';
import { getClickAndKeyDown$ } from '../../support/streams/streams';

const App = () => {
  const [displayText, setDisplayText] = useState('0');

  useEffect(() => {
    const subscription = getClickAndKeyDown$().subscribe((result) => {
      setDisplayText(result);

      document.activeElement && document.activeElement.blur();
    });

    return () => subscription();
  }, []);

  return (
    <div className="App">
      <Calculator displayText={displayText}/>

      <span id="info">
        c key = clear | Enter key = answer | Backsapce key = delete | 0-9 + / - x * (=) = supported inputs | 1+2* = generates error
      </span>
    </div>
  );
};

export default App;
