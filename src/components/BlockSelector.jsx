import React, { useState, useEffect, useContext } from 'react';
import { useText } from './Editor';

const SelectedBlockContext = React.createContext();

export const useSelectedBlock = () => {
  return useContext(SelectedBlockContext);
}

const BlockSelector = ({ children }) => {
  const text = useText();

  const [selectedID, changeSelected] = useState(() => {
    return 0;
  });

  useEffect(() => {
    changeSelected(0);
  }, [text]);

  const selectBlock = (blockID) => {
    changeSelected(blockID);
  }

  return (
    <SelectedBlockContext.Provider value={{ selectedID, selectBlock }}>
      {children}
    </SelectedBlockContext.Provider>
  )
}

export default BlockSelector;
