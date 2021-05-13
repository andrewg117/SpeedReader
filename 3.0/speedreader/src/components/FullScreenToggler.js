import React, { useState, useContext } from 'react';

export const FullIcon = (props) => {
  return (
    <i
      id={props.iconID}
      className="fas fa-expand"
      onClick={props.toggle}>
    </i>
  );
}

const ToggleFullScreenContext = React.createContext();

export const useToggleFullScreen = () => {
  return useContext(ToggleFullScreenContext);
}

const IsFullContext = React.createContext();

export const useIsFull = () => {
  return useContext(IsFullContext);
}

const FullScreenToggler = ({children}) => {
  const [ fullSelector, changeSelectorView ] = useState(() => {
    return false;
  });
  const [ fullBlock, changeBlockView ] = useState(() => {
    return false;
  });

  const toggleFullScreen = (e) => {
    if (e.target.id === 'fullPreview') {
      changeSelectorView(!fullSelector);
    } else if (e.target.id === 'fullBlock') {
      changeBlockView(!fullBlock)
    }
  }

  return (
    <ToggleFullScreenContext.Provider value={toggleFullScreen}>
      <IsFullContext.Provider value={{fullSelector, fullBlock}}>
        {children}
      </IsFullContext.Provider>
    </ToggleFullScreenContext.Provider>
  );
}

export default FullScreenToggler;