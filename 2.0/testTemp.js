const defaultText =
  "Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time.";

// main component class
class SpeedReader extends React.Component {
  state = {
    blockGroup: [],
    currentBlock: 0,
    displayText: "Load Text",
    isStarted: false,
    currentTime: 0,
    nextTime: 0
  };

  // calculates the words per minute based on the selected seed from the WPM dropdown and block size from the Block Size dropdown
  calcWPM = (wpm, blockSize) => {
    const calc = (60 / wpm) * 1000 * blockSize;
    return calc;
  }

  // timer used to increment through the block list
  timeoutTimer = () => {
    const {
      isStarted,
      currentBlock,
      blockGroup,
      currentTime
    } = this.state;

    if (isStarted) {
      if (!currentTime) {
        this.setState({
          currentTime: new Date().getTime(),
          nextTime: new Date().getTime()
        });
      }

      this.setState((state) => {
        return {
          nextTime: state.nextTime + this.calcWPM(this.props.wpmSpeed, this.props.wordsPerBlock)
        };
      });

      const nextBlock = currentBlock + 1;

      if (nextBlock < blockGroup.length) {
        this.setState({
          displayText: blockGroup[nextBlock].props.text,
          currentBlock: nextBlock,
          blockGroup: ConvertTextToBlocks(
            nextBlock,
            this.props.editorText,
            this.props.wordsPerBlock,
            this.resetReader
          )
        });

        setTimeout(
          this.timeoutTimer,
          this.state.nextTime - new Date().getTime()
        );
      } else {
        // let endStamp = new Date();
        // console.log(`End: ${endStamp.toString()}`);
        this.setState({
          isStarted: false
        });
        this.resetTime();
      }
    } else {
      this.resetTime();
    }
  }

  // starts the timeoutTimer function and changes the isStarted state
  startReader = () => {
    const { isStarted } = this.state;

    this.setState({
      isStarted: !isStarted
    });

    // let startStamp = new Date();
    // console.log(`Start: ${startStamp.toString()}`);

    this.props.closeDropdown();
    this.resetTime();
    setTimeout(this.timeoutTimer, this.calcWPM(this.props.wpmSpeed, this.props.wordsPerBlock));
  }

  // resets the SpeedReader to default values
  resetReader = (blockIndex) => {
    if (blockIndex === undefined) {
      blockIndex = 0;
    }

    this.setState((state) => {
      return {
        currentBlock: blockIndex,
        displayText: state.blockGroup[blockIndex].props.text,
        blockGroup: ConvertTextToBlocks(
          blockIndex,
          this.props.editorText,
          this.props.wordsPerBlock,
          this.resetReader
        ),
        isStarted: false
      };
    });

    this.props.closeDropdown();
    this.resetTime();
  }


  // changes the state of the wordsPerBlock value when an option in the Block dropdown is selected
  blockSizer = (e) => {
    this.props.blockSizeSelector(e);

    const blocks = ConvertTextToBlocks(
      0,
      this.props.editorText,
      parseInt(e.target.innerText),
      this.resetReader
    );

    this.setState({
      currentBlock: 0,
      blockGroup: blocks,
      displayText: blocks[0].props.text,
      isStarted: false
    });

    this.props.closeDropdown();
    this.resetTime();
  }

  // changes the state of the wpmSpeed value when an option in the WPM dropdown is selected
  wpmSelector = (e) => {
    this.props.wpmSelector(e);
    this.resetReader(0);
  }

  // clears the timeout timer and resets it's time values
  resetTime = () => {
    clearTimeout(this.timeoutTimer);
    this.setState({
      currentTime: 0,
      nextTime: 0
    });
  }

  // initializes the state for the Block list
  componentDidMount() {
    this.setState((state) => {
      return {
        blockGroup: ConvertTextToBlocks(
          state.currentBlock,
          this.props.editorText,
          this.props.wordsPerBlock,
          this.resetReader
        )
      };
    });
  }

  // clears the Block list
  componentWillUnmount() {
    this.setState({
      blockGroup: []
    });

    this.resetTime();
  }

  render() {
    const {
      blockGroup,
      displayText,
      isStarted
    } = this.state;

    const blockSizeOptions = [1, 2, 3, 4];
    const wpsSpeedOptions = [100, 200, 300, 400];

    return (
      <FullScreenToggler>
        {(fullPreview, fullBlock, toggle) => (
          <div id="main-container">
            <TextEditor
              handleEditorText={this.props.handleEditorText}
              text={this.props.editorText}
              resetReader={this.resetReader}
            />


            <ReaderTextView
              sectionID={"preview"}
              blockValue={blockGroup}
              iconID={"fullPreview"}
              fullScreen={fullPreview}
              toggle={toggle}
            />

            <ReaderTextView
              sectionID={"block-view"}
              blockValue={<p>{displayText}</p>}
              iconID={"fullBlock"}
              fullScreen={fullBlock}
              toggle={toggle}
            />

            <WordCounter text={this.props.editorText} />

            <section
              id="input-view"
              className={fullPreview || fullBlock ? "lower" : ""}
            >
              <InputButton
                className={"btn btn-light"}
                readerControl={this.startReader}
                btnText={isStarted ? "Pause" : "Start"}
              />

              <InputButton
                className={"btn btn-light"}
                readerControl={this.resetReader}
                btnText={"Reset"}
              />

              <InputDropdown
                dropdownID="blockDropdown"
                readerControl={this.props.toggleBlockDropdown}
                openMenu={this.props.blockMenuOpen}
                btnText={`Block Size (${this.props.wordsPerBlock})`}
                selector={this.blockSizer}
                options={blockSizeOptions}
              />

              <InputDropdown
                dropdownID="wpmDropdown"
                readerControl={this.props.toggleWPMDropdown}
                openMenu={this.props.wpmMenuOpen}
                btnText={`WPM (${this.props.wpmSpeed})`}
                selector={this.wpmSelector}
                options={wpsSpeedOptions}
              />
            </section>
          </div>
        )}
      </FullScreenToggler>
    );
  }
}

class HandleEditorText extends React.Component {
  state = {
    editorText: defaultText
  };

  handleEditorText = (e) => {
    this.setState({
      editorText: e.target.value
    });
  }

  render() {
    return this.props.children(this.handleEditorText, this.state.editorText);
  }
}

const TextEditor = (props) => {
  return (
    <textarea
      id="editor"
      onChange={(e) => {
        props.handleEditorText(e);
        props.resetReader(0);
      }}
      value={props.text}
    />
  );
};

// component that renders each word block
const Block = (props) => {
  const selectBlockOnClick = () => {
    props.selectBlockOnClick(props.id);
  };

  return (
    <div
      id="textBlock"
      className={props.isSelected ? "isActive" : ""}
      onClick={selectBlockOnClick}
    >
      {props.text}
    </div>
  );
};

const ConvertTextToBlocks = (selectedID, editorText, wordsPerBlock, resetReader) => {
  const splitTextArr = editorText.split(/\s/);
  let joinedTextArr = [];

  for (let i = 0; i < splitTextArr.length; i += wordsPerBlock) {
    if (splitTextArr[i] !== "") {
      joinedTextArr.push(splitTextArr.slice(i, i + wordsPerBlock).join(" "));
    }
  }

  const blocksArr = joinedTextArr.map((text, index) => {
    return (
      <Block
        key={index}
        id={index}
        text={text}
        selectBlockOnClick={resetReader}
        isSelected={selectedID == index ? true : false}
      />
    );
  });
  return (blocksArr);
}


const FullIcon = (props) => {
  return (
    <i
      id={props.iconID}
      className="fas fa-expand"
      onClick={props.toggle}>
    </i>
  );
}

class FullScreenToggler extends React.Component {
  state = {
    fullPreview: false,
    fullBlock: false
  };

  toggle = (e) => {
    if (e.target.id === 'fullPreview') {
      this.setState((state) => {
        return {
          fullPreview: !state.fullPreview
        }
      });
    } else if (e.target.id === 'fullBlock') {
      this.setState((state) => {
        return {
          fullBlock: !state.fullBlock
        }
      });
    }
  }

  render() {
    return this.props.children(
      this.state.fullPreview,
      this.state.fullBlock,
      this.toggle
    );
  }
};

const ReaderTextView = (props) => {
  return (
    <section
      id={props.sectionID}
      className={props.fullScreen ? "fullScreen" : "normal"}
    >
      {props.blockValue}
      <FullIcon iconID={props.iconID} toggle={props.toggle} />
    </section>
  );
}

const WordCounter = (props) => {
  const textArr = props.text.split(/\s/);
  let cleanTextArr = [];
  let wordCount = 0;

  for (let i = 0; i < textArr.length; i++) {
    if (textArr[i] !== "") {
      cleanTextArr.push(textArr[i]);
    }
  }
  wordCount = cleanTextArr.length;

  return <div id="wordCount">{`Word Count: ${wordCount}`}</div>;
};


class ToggleDropdownMenu extends React.Component {
  state = {
    blockMenuOpen: false,
    wpmMenuOpen: false
  };


  toggleBlockDropdown = () => {
    this.setState((state) => {
      return {
        blockMenuOpen: !state.blockMenuOpen,
        wpmMenuOpen: false
      }
    });
  }

  toggleWPMDropdown = () => {
    this.setState((state) => {
      return {
        wpmMenuOpen: !state.wpmMenuOpen,
        blockMenuOpen: false
      }
    });
  }

  closeDropdown = () => {
    this.setState({
      blockMenuOpen: false,
      wpmMenuOpen: false
    });
  }

  render() {
    return this.props.children(
      this.state.blockMenuOpen,
      this.state.wpmMenuOpen,
      this.toggleBlockDropdown,
      this.toggleWPMDropdown,
      this.closeDropdown
    );
  }
};

const InputButton = (props) => {
  const inputClick = () => {
    props.readerControl()
  }
  return (
    <button
      id={props.inputID}
      className={props.className}
      onClick={inputClick}
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

class DropdownSelector extends React.Component {
  state = {
    wordsPerBlock: 1,
    wpmSpeed: 100
  }

  blockSizeSelector = (e) => {
    this.setState({
      wordsPerBlock: parseInt(e.target.innerText)
    });
  }

  wpmSelector = (e) => {
    this.setState({
      wpmSpeed: parseInt(e.target.innerText)
    });
  }

  render() {
    return this.props.children(
      this.blockSizeSelector,
      this.wpmSelector,
      this.state.wordsPerBlock,
      this.state.wpmSpeed
    );
  }
}

const DropdownOption = (props) => {
  return (
    <li className="dropdown-item" onClick={props.selector}>
      {props.value}
    </li>
  );
};


const DisplayReader = () => {
  return (
    <HandleEditorText>
      {(handleEditorText, editorText) => (
        <DropdownSelector>
          {(
            blockSizeSelector,
            wpmSelector,
            wordsPerBlock,
            wpmSpeed
          ) => (
            <ToggleDropdownMenu>
              {(
                blockMenuOpen,
                wpmMenuOpen,
                toggleBlockDropdown,
                toggleWPMDropdown,
                closeDropdown
              ) => (
                <SpeedReader
                  handleEditorText={handleEditorText}
                  editorText={editorText}
                  blockSizeSelector={blockSizeSelector}
                  wpmSelector={wpmSelector}
                  wordsPerBlock={wordsPerBlock}
                  wpmSpeed={wpmSpeed}
                  blockMenuOpen={blockMenuOpen}
                  wpmMenuOpen={wpmMenuOpen}
                  toggleBlockDropdown={toggleBlockDropdown}
                  toggleWPMDropdown={toggleWPMDropdown}
                  closeDropdown={closeDropdown}
                />
              )}
            </ToggleDropdownMenu>
          )}
        </DropdownSelector>
      )}
    </HandleEditorText>
  );
};

ReactDOM.render(<DisplayReader />, document.getElementById("root"));