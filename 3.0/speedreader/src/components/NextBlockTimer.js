import React, { useContext, useEffect, useCallback, useRef } from 'react';
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
  const currentTime = useRef(0);
  const nextTime = useRef(0);

  // const [currentTime, changeCurrentTime] = useState(() => 0);
  // const [nextTime, changeNextTime] = useState(() => 0);

  const readerTimer = useCallback((selectedID) => {
    if (!currentTime.current) {
      let newStamp = new Date().getTime();
      currentTime.current = newStamp;
      nextTime.current = newStamp;
      // changeCurrentTime(newStamp);
      // changeNextTime(newStamp);
    }

    nextTime.current = nextTime.current + CalculateWPM(wpmSpeed, wordsPerBlock);
    // changeNextTime((state) => state + CalculateWPM(wpmSpeed, wordsPerBlock));

    // BUG: timers not updating correctly
    /* let diff = (new Date().getTime() - currentTime.current) % CalculateWPM(wpmSpeed, wordsPerBlock);
    console.log(`${selectedID}: ${diff} ms`); */

    const nextBlock = selectedID + 1;

    if (isStarted && nextBlock < blockGroup.length) {
      selectBlock(nextBlock);

      timerRef.current = setTimeout(() => {
        readerTimer(selectedID)
      }, nextTime.current  - new Date().getTime());
    } else {
      let endStamp = new Date();
      console.log(`End: ${endStamp.toString()}`);
      clearTimeout(timerRef.current);
      timerRef.current = 0;
      pauseTimer();
      pauseReader();
    }
  }, [isStarted, nextTime, blockGroup.length, currentTime, selectBlock, wordsPerBlock, wpmSpeed, pauseReader]);

  const startTimer = () => {
    let startStamp = new Date();
    console.log(`Start: ${startStamp.toString()}`);

    resetTimer();
  }

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = 0;
    currentTime.current = 0;
    nextTime.current = 0;
    // changeCurrentTime(0);
    // changeNextTime(0);
  }

  const resetTimer = () => {
    pauseTimer();

    let resetCount = setTimeout(() => selectBlock(0), 400);
    return () => clearTimeout(resetCount);
  }

  useEffect(() => {
    if (isStarted && timerRef.current === 0) {
      timerRef.current = setTimeout(() => {
        readerTimer(selectedID);
      }, CalculateWPM(wpmSpeed, wordsPerBlock));
    }

    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = 0;
    }
  }, [isStarted, selectedID, wordsPerBlock, wpmSpeed, readerTimer]);

  return (
    <TimerContext.Provider value={{ startTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );

}

export default NextBlockTimer;