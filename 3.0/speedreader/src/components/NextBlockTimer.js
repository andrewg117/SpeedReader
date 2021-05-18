import React, { useState, useContext } from 'react';
import { useChangeBlock, useSelectedBlock } from './BlockSelector';
import { useBlockGroup } from './CreateBlocks';
import { useIsStarted, useControl, useSelectValue } from './UserInput';

const CalculateWPM = (wpm, blockSize) => {
  const calc = (60 / wpm) * 1000 * blockSize;
  return calc;
}

const TimerContext = React.createContext();

export const useTimer = () => {
  return useContext(TimerContext);
}

const NextBlockTimer = ({ children }) => {
  const isStarted = useIsStarted();
  const { pauseReader } = useControl();
  const { wordsPerBlock, wpmSpeed } = useSelectValue();
  const selectedID = useSelectedBlock();
  const changeSelected = useChangeBlock();
  const blockGroup = useBlockGroup();

  const [currentTime, changeCurrentTime] = useState(() => {
    return 0;
  });
  const [nextTime, changeNextTime] = useState(() => {
    return 0;
  });

  const readerTimer = () => {
    // BUG: isStarted is returning false
    console.log(isStarted);
    if (isStarted) {
      if (!currentTime) {
        changeCurrentTime(new Date().getTime());
        changeNextTime(new Date().getTime());
      }

      changeNextTime((state) => state + CalculateWPM(wpmSpeed, wordsPerBlock));

      const nextBlock = selectedID + 1;

      if (nextBlock < blockGroup.length) {
        console.log(nextBlock);
        changeSelected(nextBlock);

        setTimeout(
          readerTimer,
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
      // pauseReader();
    }
  }

  const resetTimer = () => {
    clearTimeout(readerTimer);
    changeCurrentTime(0);
    changeNextTime(0);
  }

  const startTimer = () => {
    resetTimer();
    setTimeout(readerTimer, CalculateWPM(wpmSpeed, wordsPerBlock));
  }

  return (
    <TimerContext.Provider value={startTimer}>
    {/* <div style={{color: 'white'}}>{`${isStarted}`}</div> */}
      {children}
    </TimerContext.Provider>
  );

}

export default NextBlockTimer;