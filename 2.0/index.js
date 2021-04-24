const defaultText =
  "Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time.";

// main component class
class SpeedReader extends React.Component {
  constructor(props) {
    super(props);
    this.startReader = this.startReader.bind(this);
    this.resetReader = this.resetReader.bind(this);
    this.openBlockMenu = this.openBlockMenu.bind(this);
    this.openWPMMenu = this.openWPMMenu.bind(this);
    this.blockSizer = this.blockSizer.bind(this);
    this.wpmSelector = this.wpmSelector.bind(this);
    this.timeoutTimer = this.timeoutTimer.bind(this);

    this.state = {
      blockGroup: [],
      currentBlock: 0,
      displayText: "Load Text",
      wordsPerBlock: 1,
      blockMenuOpen: false,
      wpmMenuOpen: false,
      isStarted: false,
      wpmSpeed: 100,
      currentTime: 0,
      nextTime: 0
    };
  }

  // converts the editor text to a list of Block components
  convertTextToBlock(selectedID, text, wordsPerBlock) {
    const splitTextArr = text.split(/\s/);
    let joinedTextArr = [];

    for (let i = 0; i < splitTextArr.length; i += wordsPerBlock) {
      if (splitTextArr[i] !== "") {
        joinedTextArr.push(splitTextArr.slice(i, i + wordsPerBlock).join(" "));
      }
    }

    const blocksArr = joinedTextArr.map((text, i) => {
      if (selectedID == i) {
        return (
          <Block
            key={i}
            id={i}
            text={text}
            selectBlockOnClick={this.resetReader}
            isSelected={true}
          />
        );
      }
      return (
        <Block
          key={i}
          id={i}
          text={text}
          selectBlockOnClick={this.resetReader}
          isSelected={false}
        />
      );
    });
    return blocksArr;
  }

  // calculates the words per minute based on the selected seed from the WPM dropdown and block size from the Block Size dropdown
  calcWPM(wpm, block) {
    const calc = (60 / wpm) * 1000 * block;
    return calc;
  }

  // timer used to increment through the block list
  timeoutTimer() {
    const {
      isStarted,
      currentBlock,
      blockGroup,
      wordsPerBlock,
      wpmSpeed,
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
          nextTime: state.nextTime + this.calcWPM(wpmSpeed, wordsPerBlock)
        };
      });

      const nextBlock = currentBlock + 1;

      if (nextBlock < blockGroup.length) {
        this.setState({
          displayText: blockGroup[nextBlock].props.text,
          currentBlock: nextBlock,
          blockGroup: this.convertTextToBlock(
            nextBlock,
            this.props.editorText,
            wordsPerBlock
          )
        });

        setTimeout(
          this.timeoutTimer,
          this.state.nextTime - new Date().getTime()
        );
      } else {
        let endStamp = new Date();
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
  startReader() {
    const { isStarted, wpmSpeed, wordsPerBlock } = this.state;

    this.setState({
      isStarted: !isStarted,
      wpmMenuOpen: false,
      blockMenuOpen: false
    });

    let startStamp = new Date();
    // console.log(`Start: ${startStamp.toString()}`);

    this.resetTime();
    setTimeout(this.timeoutTimer, this.calcWPM(wpmSpeed, wordsPerBlock));
  }

  // resets the SpeedReader to default values
  resetReader(blockIndex) {
    if (blockIndex === undefined) {
      blockIndex = 0;
    }

    this.setState((state) => {
      return {
        currentBlock: blockIndex,
        displayText: state.blockGroup[blockIndex].props.text,
        blockGroup: this.convertTextToBlock(
          blockIndex,
          this.props.editorText,
          state.wordsPerBlock
        ),
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });

    this.resetTime();
  }

  // opens the Block Size dropdown
  openBlockMenu() {
    this.setState((state) => {
      return {
        blockMenuOpen: !state.blockMenuOpen,
        wpmMenuOpen: false
      };
    });
  }

  // opens the WPM dropdown
  openWPMMenu() {
    this.setState((state) => {
      return {
        wpmMenuOpen: !state.wpmMenuOpen,
        blockMenuOpen: false
      };
    });
  }

  // changes the state of the wordsPerBlock value when an option in the Block dropdown is selected
  blockSizer(e) {
    this.setState((state) => {
      const blocks = this.convertTextToBlock(
        0,
        this.props.editorText,
        parseInt(e.target.innerText)
      );
      return {
        wpmMenuOpen: false,
        blockMenuOpen: false,
        wordsPerBlock: parseInt(e.target.innerText),
        currentBlock: 0,
        blockGroup: blocks,
        displayText: blocks[0].props.text,
        isStarted: false,
        wpmSpeed: state.wpmSpeed
      };
    });
    this.resetTime();
  }

  // changes the state of the wpmSpeed value when an option in the WPM dropdown is selected
  wpmSelector(e) {
    this.setState((state) => {
      return {
        wpmMenuOpen: false,
        currentBlock: 0,
        blockGroup: this.convertTextToBlock(
          0,
          this.props.editorText,
          state.wordsPerBlock
        ),
        displayText: state.blockGroup[0].props.text,
        isStarted: false,
        wpmSpeed: parseInt(e.target.innerText)
      };
    });
    this.resetTime();
  }

  // clears the timeout timer and resets it's time values
  resetTime() {
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
        blockGroup: this.convertTextToBlock(
          state.currentBlock,
          this.props.editorText,
          state.wordsPerBlock
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
      blockMenuOpen,
      wordsPerBlock,
      isStarted,
      wpmSpeed,
      wpmMenuOpen
    } = this.state;

    const blockSizeOptions = [1, 2, 3, 4];
    const wpsSpeedOptions = [100, 200, 300, 400];

    return (
      <div id="main-container">
        <TextEditor
          handleEditorText={this.props.handleEditorText}
          text={this.props.editorText}
          resetReader={this.resetReader}
        />


        <FullScreenToggler>
          {(fullPreview, fullBlock, toggle) => (
            <>
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
                  readerControl={this.openBlockMenu}
                  openMenu={blockMenuOpen}
                  btnText={`Block Size (${wordsPerBlock})`}
                  selector={this.blockSizer}
                  options={blockSizeOptions}
                />

                <InputDropdown
                  readerControl={this.openWPMMenu}
                  openMenu={wpmMenuOpen}
                  btnText={`WPM (${wpmSpeed})`}
                  selector={this.wpmSelector}
                  options={wpsSpeedOptions}
                />
              </section>
            </>
          )}
        </FullScreenToggler>
      </div>
    );
  }
}

class HandleEditorText extends React.Component {
  constructor(props) {
    super(props);
    this.handleEditorText = this.handleEditorText.bind(this);

    this.state = {
      editorText: defaultText
    };
  }

  handleEditorText(e) {
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
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      fullPreview: false,
      fullBlock: false
    };
  }

  toggle(e) {
    if(e.target.id === 'fullPreview'){
      this.setState({
        fullPreview: !this.state.fullPreview
      });
    } else if (e.target.id === 'fullBlock') {
      this.setState({
        fullBlock: !this.state.fullBlock
      });
    }
  }

  render() {
    return this.props.children(this.state.fullPreview, this.state.fullBlock, this.toggle);
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

const InputButton = (props) => {
  const inputClick = () => {
    props.readerControl()
  }
  return (
    <button className={props.className} onClick={inputClick}>
      {props.btnText}
    </button>
  );
};

const InputDropdown = (props) => {
  const options = props.options.map((value, i) => {
    return <DropdownOption key={i} selector={props.selector} value={value} />;
  });

  return (
    <div className="dropup">
      <InputButton
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
        <SpeedReader
          handleEditorText={handleEditorText}
          editorText={editorText}
        />
      )}
    </HandleEditorText>
  );
};

ReactDOM.render(<DisplayReader />, document.getElementById("root"));