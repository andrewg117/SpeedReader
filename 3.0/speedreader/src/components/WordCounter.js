import React, { useState, useEffect } from 'react';
import { useText } from './Editor';

const WordCounter = (text) => {
  const textArr = text.split(/\s/);
  let cleanTextArr = [];
  let wordCount = 0;

  for (let i = 0; i < textArr.length; i++) {
    if (textArr[i] !== "") {
      cleanTextArr.push(textArr[i]);
    }
  }
  wordCount = cleanTextArr.length;

  return wordCount;
};

const DisplayCount = () => {
  const text = useText();

  const [count, changeCount] = useState(() => {
    return 0
  });

  useEffect(() => {
    changeCount(WordCounter(text));
  }, [text]);

  return <div id="wordCount">{`Word Count: ${count}`}</div>;
}

export default DisplayCount;