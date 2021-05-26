import React from 'react';
import { useIsFull } from './FullScreenToggler';
import { useControl, useIsMenuOpen, useToggleMenu, useSelectValue, useOptions } from './UserInput';
import { useTimer } from './NextBlockTimer';

const InputButton = (props) => {
  const { resetTimer } = useTimer();

  return (
    <button
      id={props.inputID}
      className={props.className}
      onClick={() => {
        props.readerControl();
        if (props.id === "btnStart") {
          let startStamp = new Date();
          console.log(`Start: ${startStamp.toString()}`);
          // startTimer();
        }
        if (props.id === "btnReset") {
          resetTimer();
        }
      }}
    >
      {props.btnText}
    </button>
  );
};

const DropdownOption = (props) => {
  return (
    <li className="dropdown-item" onClick={props.selector}>
      {props.value}
    </li>
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

const DisplayUserInputs = () => {
  const { fullSelector, fullBlock } = useIsFull();
  const { isStarted, startReader, pauseReader } = useControl();
  const { blockMenuOpen, wpmMenuOpen } = useIsMenuOpen();
  const { toggleBlockDropdown, toggleWPMDropdown } = useToggleMenu();
  const { wordsPerBlock, wpmSpeed } = useSelectValue();
  const { blockSizeSelector, wpmSelector } = useOptions();


  const blockSizeOptions = [1, 2, 3, 4];
  const wpsSpeedOptions = [100, 200, 300, 400];

  return (
    <section
      id="input-view"
      className={fullSelector || fullBlock ? "lower" : ""}
    >
      <InputButton
        id="btnStart"
        className={"btn btn-light"}
        readerControl={startReader}
        btnText={isStarted ? "Pause" : "Start"}
      />

      <InputButton
        id="btnReset"
        className={"btn btn-light"}
        readerControl={pauseReader}
        btnText={"Reset"}
      />

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
    </section>
  );
}

export default DisplayUserInputs;