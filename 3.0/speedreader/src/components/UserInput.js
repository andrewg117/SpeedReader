import React, { useState, useEffect, useContext } from 'react';

const IsStartedContext = React.createContext();
const ControlContext = React.createContext();

export const useIsStarted = () => {
  return useContext(IsStartedContext);
}
export const useControl = () => {
  return useContext(ControlContext);
}

export const ReaderControls = ({ children }) => {
  const [isStarted, toggleStarted] = useState(() => {
    return false;
  });

  const startReader = () => {
    toggleStarted((state) => !state);
  }

  const pauseReader = () => {
    toggleStarted(false);
  }

  return (
    <IsStartedContext.Provider value={isStarted}>
      <ControlContext.Provider value={{ startReader, pauseReader }}>
        {children}
      </ControlContext.Provider>
    </IsStartedContext.Provider>
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
  const [wordsPerBlock, selectSize] = useState(() => {
    return 1;
  });
  const [wpmSpeed, selectWPM] = useState(() => {
    return 100;
  });


  const blockSizeSelector = (e) => {
    selectSize(parseInt(e.target.innerText));
  }

  const wpmSelector = (e) => {
    selectWPM(parseInt(e.target.innerText));
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