import React, { useState, useEffect, useContext } from 'react';
import { useIsFull } from './FullScreenToggler';

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

const ToggleDropdownMenu = ({ children }) => {
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

const InputButton = (props) => {
  return (
    <button
      id={props.inputID}
      className={props.className}
      onClick={props.readerControl}
    >
      {props.btnText}
    </button>
  );
};

const InputDropdown = (props) => {
  const options = props.options.map((value, i) => {
    return (
      <DropdownOption
        key={i}
        selector={props.selector}
        value={value}
      />
    );
  });

  return (
    <div className="dropup">
      <InputButton
        inputID={props.dropdownID}
        className={"btn btn-light dropdown-toggle"}
        readerControl={props.readerControl}
        btnText={props.btnText}
      />
      <ul className={`dropdown-menu${props.openMenu ? " show" : ""}`}>
        {options}
      </ul>
    </div>
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

const DropdownOption = (props) => {
  return (
    <li className="dropdown-item" onClick={props.selector}>
      {props.value}
    </li>
  );
};

const DisplayUserInputs = () => {
  const { fullSelector, fullBlock } = useIsFull();
  const isStarted = useIsStarted();
  const { startReader, pauseReader } = useControl();
  /* const { blockMenuOpen, wpmMenuOpen } = useIsMenuOpen();
  const { toggleBlockDropdown, toggleWPMDropdown } = useToggleMenu();
  const { wordsPerBlock, wpmSpeed } = useSelectValue();
  const { blockSizeSelector, wpmSelector } = useOptions(); */


  const blockSizeOptions = [1, 2, 3, 4];
  const wpsSpeedOptions = [100, 200, 300, 400];

  return (
    <section
      id="input-view"
      className={fullSelector || fullBlock ? "lower" : ""}
    >
      <InputButton
        className={"btn btn-light"}
        readerControl={startReader}
        btnText={isStarted ? "Pause" : "Start"}
      />

      <InputButton
        className={"btn btn-light"}
        readerControl={pauseReader}
        btnText={"Reset"}
      />
      {/* BUG: ToggleDropdownMenu Context functions are undefined */}
      {/* <ToggleDropdownMenu>
        <InputDropdown
          dropdownID="blockDropdown"
          readerControl={toggleBlockDropdown}
          openMenu={blockMenuOpen}
          btnText={`Block Size (${wordsPerBlock})`}
          selector={blockSizeSelector}
          options={blockSizeOptions}
        />

        <InputDropdown
          dropdownID="wpmDropdown"
          readerControl={toggleWPMDropdown}
          openMenu={wpmMenuOpen}
          btnText={`WPM (${wpmSpeed})`}
          selector={wpmSelector}
          options={wpsSpeedOptions}
        />
      </ToggleDropdownMenu> */}
    </section>
  );
}

export default DisplayUserInputs;