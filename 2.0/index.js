const defaultText =
  "Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time.";

// main component class
class App extends React.Component {
  constructor(props) {
    super(props);
    this.selectBlockOnClick = this.selectBlockOnClick.bind(this);
    this.handleEditorText = this.handleEditorText.bind(this);
    this.startReader = this.startReader.bind(this);
    this.resetReader = this.resetReader.bind(this);
    this.openBlockMenu = this.openBlockMenu.bind(this);
    this.openWPMMenu = this.openWPMMenu.bind(this);
    this.blockSizer = this.blockSizer.bind(this);
    this.wpmSelector = this.wpmSelector.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
    this.timeoutTimer = this.timeoutTimer.bind(this);

    this.currentTime;
    this.nextTime;

    this.state = {
      text: defaultText,
      blockGroup: [],
      currentBlock: 0,
      displayText: "Load Text",
      wordsPerBlock: 1,
      blockMenuOpen: false,
      wpmMenuOpen: false,
      isStarted: false,
      wpmSpeed: 100,
      fullPreview: false,
      fullBlock: false
    };
  }

  // handles the value input from the editor and update the text and other state properties
  handleEditorText(e) {
    this.setState((state) => {
      return {
        text: e.target.value,
        currentBlock: 0,
        displayText: state.blockGroup[0].props.text,
        blockGroup: this.convertTextToBlock(0, state.text, state.wordsPerBlock),
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });
    this.resetTime();
  }

  // changes the display text and selected block to the block selected by the user in the preview element
  selectBlockOnClick(id, value) {
    this.setState((state) => {
      return {
        displayText: value,
        currentBlock: id,
        blockGroup: this.convertTextToBlock(id, state.text, state.wordsPerBlock),
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });
    this.resetTime();
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

    const blockArr = joinedTextArr.map((text, i) => {
      if (selectedID == i) {
        return (
          <Block
            key={i}
            id={i}
            text={text}
            selectBlockOnClick={this.selectBlockOnClick}
            isSelected={true}
          />
        );
      }
      return (
        <Block
          key={i}
          id={i}
          text={text}
          selectBlockOnClick={this.selectBlockOnClick}
          isSelected={false}
        />
      );
    });
    return blockArr;
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
      text,
      wpmSpeed,
      wordsPerBlock
    } = this.state;

    if (isStarted) {
      if (!this.currentTime) {
        this.currentTime = new Date().getTime();
        this.nextTime = this.currentTime;
      }
      this.nextTime += this.calcWPM(wpmSpeed, wordsPerBlock);

      const nextBlock = currentBlock + 1;

      if (nextBlock < blockGroup.length) {
        this.setState({
          displayText: blockGroup[nextBlock].props.text,
          currentBlock: nextBlock,
          blockGroup: this.convertTextToBlock(nextBlock, text, wordsPerBlock)
        });

        setTimeout(this.timeoutTimer, this.nextTime - new Date().getTime());
      } else {
        let endStamp = new Date();
        console.log(`End: ${endStamp.toString()}`);
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
    const {
      isStarted,
      wpmSpeed,
      wordsPerBlock
    } = this.state;

    this.setState({
      isStarted: !isStarted,
      wpmMenuOpen: false,
      blockMenuOpen: false
    });

    let startStamp = new Date();
    console.log(`Start: ${startStamp.toString()}`);

    this.resetTime();
    setTimeout(this.timeoutTimer, this.calcWPM(wpmSpeed, wordsPerBlock));
  }

  // resets the App to default values
  resetReader() {
    this.setState((state) => {
      return {
        // text: defaultText,
        currentBlock: 0,
        displayText: state.blockGroup[0].props.text,
        blockGroup: this.convertTextToBlock(0, state.text, state.wordsPerBlock),
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
      const blocks = this.convertTextToBlock(0, state.text, parseInt(e.target.innerText));
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
        blockGroup: this.convertTextToBlock(0, state.text, state.wordsPerBlock),
        displayText: state.blockGroup[0].props.text,
        isStarted: false,
        wpmSpeed: parseInt(e.target.innerText)
      };
    });
    this.resetTime();
  }

  // toggles the fullscreen state of the preview or block view
  toggleFullScreen(e) {
    if (e.target.id == 'fullBlock') {
      this.setState({
        fullBlock: !this.state.fullBlock
      })
    } else if (e.target.id == 'fullPreview') {
      this.setState({
        fullPreview: !this.state.fullPreview
      })
    }
  }

  // clears the timeout timer and resets it's time values
  resetTime() {
    clearTimeout(this.timeoutTimer);
    this.currentTime = 0;
    this.nextTime = 0;
  }

  // initializes the state for the Block list
  componentDidMount() {
    this.setState((state) => {
      return {
        blockGroup: this.convertTextToBlock(state.currentBlock, state.text, state.wordsPerBlock)
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
      text,
      blockGroup,
      displayText,
      blockMenuOpen,
      wordsPerBlock,
      isStarted,
      wpmSpeed,
      wpmMenuOpen,
      fullPreview,
      fullBlock,
      wordCount
    } = this.state;

    const blockSizeOptions = [1, 2, 3, 4];
    const wpsSpeedOptions = [100, 200, 300, 400]

    return (
      <div id="main-container">
        <TextEditor
          handleEditorText={this.handleEditorText}
          text={text}
        />

        <TextPreview
          sectionID={"preview"}
          textBlocks={blockGroup}
          isFullScreen={fullPreview}
          toggler={this.toggleFullScreen}
        />

        <BlockView
          sectionID={"block-view"}
          displayText={displayText}
          isFullScreen={fullBlock}
          toggler={this.toggleFullScreen}
        />

        <WordCounter text={text} />

        <section id="input-view" className={(fullPreview || fullBlock) ? "lower" : ""}>
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
      </div>
    );
  }
}

const TextEditor = (props) => {
  return (
    <textarea
      id="editor"
      onChange={props.handleEditorText}
      value={props.text}
    />
  );
}

// component that renders each word block
const Block = (props) => {
  const selectBlockOnClick = () => {
    props.selectBlockOnClick(props.id, props.text);
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

const TextPreview = (props) => {
  return (
    <section id={props.sectionID} className={props.isFullScreen ? "fullScreen" : "normal"}>
      {props.textBlocks}
      <FullScreenToggler iconID={"fullPreview"} toggler={props.toggler} />
    </section>
  );
}


const BlockView = (props) => {
  return (
    <section id={props.sectionID} className={props.isFullScreen ? "fullScreen" : "normal"}>
      <p>{props.displayText}</p>
      <FullScreenToggler iconID={"fullBlock"} toggler={props.toggler} />
    </section>
  );
}

const FullScreenToggler = (props) => {
  return (
    <i id={props.iconID} className="fas fa-expand" onClick={props.toggler}></i>
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

  return (
    <div id="wordCount">{`Word Count: ${wordCount}`}</div>
  );
}


const InputButton = (props) => {
  return (
    <button className={props.className} onClick={props.readerControl}>
      {props.btnText}
    </button>
  );
}


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
        className={"btn btn-light dropdown-toggle"}
        readerControl={props.readerControl}
        btnText={props.btnText}
      />
      <ul className={`dropdown-menu${props.openMenu ? " show" : ""}`}>
        {options}
      </ul>
    </div>
  );
}

const DropdownOption = (props) => {
  return (
    <li className="dropdown-item" onClick={props.selector}>
      {props.value}
    </li>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
