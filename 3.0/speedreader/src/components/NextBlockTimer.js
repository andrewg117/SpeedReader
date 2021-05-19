import React, { useState, useContext, useEffect } from 'react';
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

  const [currentTime, changeCurrentTime] = useState(0);
  // const [nextTime, changeNextTime] = useState(0);

  const readerTimer = (selectedID) => {
    let nextTime = 0;

    if (isStarted) {
      if (!currentTime) {
        changeCurrentTime(new Date().getTime());
        nextTime = new Date().getTime();
        // changeNextTime(new Date().getTime());
      }

      nextTime = nextTime + CalculateWPM(wpmSpeed, wordsPerBlock);
      // changeNextTime(state => state + CalculateWPM(wpmSpeed, wordsPerBlock));
      console.log(nextTime);

      const nextBlock = selectedID + 1;

      if (nextBlock < blockGroup.length) {
        selectBlock(nextBlock);

        setTimeout(
          readerTimer(nextBlock),
          nextTime - new Date().getTime()
        );
      } else {
        let endStamp = new Date();
        console.log(`End: ${endStamp.toString()}`);
        pauseReader();
        resetTimer();
      }
    } else {
      resetTimer();
    }
  }

  const resetTimer = () => {
    clearTimeout(readerTimer);
    changeCurrentTime(0);
    // changeNextTime(0);
  }

  const startTimer = () => {
    let startStamp = new Date();
    console.log(`Start: ${startStamp.toString()}`);

    resetTimer();
    setTimeout(readerTimer, CalculateWPM(wpmSpeed, wordsPerBlock));
  }

  useEffect(() => {
    if (isStarted) {
      setTimeout(readerTimer(selectedID), CalculateWPM(wpmSpeed, wordsPerBlock));
    } else {
      clearTimeout(readerTimer);
    }

    return () => {
      clearTimeout(readerTimer);
    }
  }, [isStarted]);

  return (
    <TimerContext.Provider value={{ startTimer, resetTimer }}>
      <div style={{ color: 'white' }}>{`${isStarted}`}</div>
      {children}
    </TimerContext.Provider>
  );

}

export default NextBlockTimer;