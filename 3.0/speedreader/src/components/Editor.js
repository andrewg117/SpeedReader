import React, { useState, useContext } from 'react';

const defaultText =
  "Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time.";

const TextContext = React.createContext();

export const useText = () => {
  return useContext(TextContext);
}

const Editor = ({ children }) => {
  const [text, changeText] = useState(() => {
    return defaultText
  });

  const handleInput = (e) => {
    changeText(e.target.value);
  }

  return (
    <TextContext.Provider value={text}>
      <textarea
        id="editor"
        onChange={(e) => {
          handleInput(e);
        }}
        value={text}
      />
      {children}
    </TextContext.Provider>
  )
}

export default Editor;