import React, { useState, useEffect, useContext } from 'react';
import { useSelectedBlock } from './BlockSelector';

const ControlContext = React.createContext();

export const useControl = () => {
  return useContext(ControlContext);
}

export const ReaderControls = ({ children }) => {
  const [isStarted, toggleStarted] = useState(() => {
    return false;
  });

  const startReader = () => {
    toggleStarted(!isStarted);
  }

  const pauseReader = () => {
    toggleStarted(false);
  }

  return (
    <ControlContext.Provider value={{ isStarted, startReader, pauseReader }}>
      {children}
    </ControlContext.Provider>
  );
}

const IsMenuOpenContext = React.createContext();
const ToggleMenuContext = React.createContext();

export const useIsMenuOpen = () => {
  return useContext(IsMenuOpenContext);
}
export const useToggleMenu = () => {
  return useContext(ToggleMenuContext);
}

export const ToggleDropdownMenu = ({ children }) => {
  const [blockMenuOpen, toggleBlockMenu] = useState(() => {
    return false;
  });
  const [wpmMenuOpen, toggleWPMMenu] = useState(() => {
    return false;
  });


  const toggleBlockDropdown = () => {
    toggleBlockMenu(!blockMenuOpen);
  }

  const toggleWPMDropdown = () => {
    toggleWPMMenu(!wpmMenuOpen);
  }

  const closeDropdown = () => {
    toggleBlockMenu(false);
    toggleWPMMenu(false);
  }

  useEffect(() => {
    document.addEventListener('mouseup', closeDropdown);

    return () => {
      document.removeEventListener('mouseup', closeDropdown);
    }
  }, [blockMenuOpen, wpmMenuOpen]);

  return (
    <IsMenuOpenContext.Provider value={{ blockMenuOpen, wpmMenuOpen }}>
      <ToggleMenuContext.Provider value={{ toggleBlockDropdown, toggleWPMDropdown }}>
        {children}
      </ToggleMenuContext.Provider>
    </IsMenuOpenContext.Provider>
  );
};

const SelectValueContext = React.createContext();
const OptionsContext = React.createContext();

export const useSelectValue = () => {
  return useContext(SelectValueContext);
}
export const useOptions = () => {
  return useContext(OptionsContext);
}

export const DropdownSelector = ({ children }) => {
  const { pauseReader } = useControl();
  const { selectBlock } = useSelectedBlock();

  const [wordsPerBlock, selectSize] = useState(() => {
    return 1;
  });
  const [wpmSpeed, selectWPM] = useState(() => {
    return 100;
  });

  const blockSizeSelector = (e) => {
    selectSize(parseInt(e.target.innerText));
    pauseReader();
    selectBlock(0);
  }

  const wpmSelector = (e) => {
    selectWPM(parseInt(e.target.innerText));
    pauseReader();
    selectBlock(0);

  }

  return (
    <SelectValueContext.Provider value={{ wordsPerBlock, wpmSpeed }}>
      <OptionsContext.Provider value={{ blockSizeSelector, wpmSelector }}>
        {children}
      </OptionsContext.Provider>
    </SelectValueContext.Provider>
  );
}


export default ReaderControls;