import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useSelectedBlock } from './BlockSelector';
import { useBlockGroup } from './CreateBlocks';
import { useControl, useSelectValue } from './UserInput';

const CalculateWPM = (wpm, blockSize) => {
  const calc = (60 / wpm) * 1000 * blockSize;
  return calc;
}

const TimerContext = React.createContext();

export const useTimer = () => {
  return useContext(TimerContext);
}

const NextBlockTimer = ({ children }) => {
  const { isStarted, pauseReader } = useControl();
  const { wordsPerBlock, wpmSpeed } = useSelectValue();
  const { selectedID, selectBlock } = useSelectedBlock();
  const blockGroup = useBlockGroup();
  const timerRef = useRef(0);

  const [currentTime, changeCurrentTime] = useState(() => 0);
  const [nextTime, changeNextTime] = useState(() => 0);

  const readerTimer = useCallback((selectedID) => {
    if (isStarted) {
      if (!currentTime) {
        changeCurrentTime(new Date().getTime());
        changeNextTime(new Date().getTime());
      }

      changeNextTime(nextTime + CalculateWPM(wpmSpeed, wordsPerBlock));

      const nextBlock = selectedID + 1;

      if (nextBlock < blockGroup.length) {
        selectBlock(nextBlock);

        timerRef.current = setTimeout(() => {
          readerTimer(nextBlock);
        }, nextTime - new Date().getTime());
      } else {
        let endStamp = new Date();
        console.log(`End: ${endStamp.toString()}`);
        clearTimeout(timerRef.current);
        timerRef.current = 0;
        changeCurrentTime(0);
        changeNextTime(0);
        pauseReader();
      }
    }

  }, [isStarted, nextTime, blockGroup.length, currentTime, selectBlock, wordsPerBlock, wpmSpeed, pauseReader]);

  const startTimer = () => {
    let startStamp = new Date();
    console.log(`Start: ${startStamp.toString()}`);

    resetTimer();
    setTimeout(readerTimer(selectedID), CalculateWPM(wpmSpeed, wordsPerBlock));
  }

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = 0;
    changeCurrentTime(0);
    changeNextTime(0);
  }

  const resetTimer = () => {
    pauseTimer();
    
    let resetCount = setTimeout(() => selectBlock(0), 300);
    return () => clearTimeout(resetCount);
  }

  useEffect(() => {
    if (isStarted) {
      timerRef.current = setTimeout(() => {
        readerTimer(selectedID);
      }, CalculateWPM(wpmSpeed, wordsPerBlock));
    }

    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = 0;
      changeCurrentTime(0);
      changeNextTime(0);
    }
  }, [isStarted, readerTimer, selectedID, wordsPerBlock, wpmSpeed]);

  return (
    <TimerContext.Provider value={{ startTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );

}

export default NextBlockTimer;