const defaultText =
  "Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time.";

// main component class
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      fullBlock: false,
      wordCount: 0
    };
  }

  // handles the value input from the editor and update the text and other state properties
  handleChange(e) {
    this.setState((state) => {
      return {
        text: e.target.value,
        currentBlock: 0,
        displayText: state.blockGroup[0].props.text,
        blockGroup: this.convertText(0, state.text, state.wordsPerBlock),
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });
    this.wordCounter();
    this.resetTime();
  }

  // changes the display text and selected block to the block selected by the user in the preview element
  handleClick(id, value) {
    this.setState((state) => {
      return {
        displayText: value,
        currentBlock: id,
        blockGroup: this.convertText(id, state.text, state.wordsPerBlock),
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });
    this.resetTime();
  }

  // converts the editor text to a list of Block components
  convertText(selectedID, text, wordsPerBlock) {
    const arr = text.split(/\s/);
    let temp = [];
    let wordLen = wordsPerBlock;

    for (let i = 0; i < arr.length; i += wordLen) {
      if (arr[i] !== "") {
        temp.push(arr.slice(i, i + wordLen).join(" "));
      }
    }

    const newArr = temp.map((text, i) => {
      if (selectedID == i) {
        return (
          <Block
            key={i}
            id={i}
            text={text}
            handleClick={this.handleClick}
            isSelected={true}
          />
        );
      }
      return (
        <Block
          key={i}
          id={i}
          text={text}
          handleClick={this.handleClick}
          isSelected={false}
        />
      );
    });
    return newArr;
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
    
    if(isStarted) {
      if(!this.currentTime) {
          this.currentTime = new Date().getTime();
          this.nextTime = this.currentTime;
        }
      this.nextTime += this.calcWPM(wpmSpeed, wordsPerBlock);
    
      const nextBlock = currentBlock + 1;

      if (nextBlock < blockGroup.length) {
        this.setState({
          displayText: blockGroup[nextBlock].props.text,
          currentBlock: nextBlock,
          blockGroup: this.convertText(nextBlock, text, wordsPerBlock)
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

    /* let timer = setInterval(() => {
      const {
        isStarted,
        currentBlock,
        blockGroup,
        text, 
        wordsPerBlock
      } = this.state;
      const nextBlock = currentBlock + 1;

      if (isStarted && nextBlock < blockGroup.length) {
        this.setState({
          displayText: blockGroup[nextBlock].props.text,
          currentBlock: nextBlock,
          blockGroup: this.convertText(nextBlock, text, wordsPerBlock)
        });
      } else {
        let endStamp = new Date();
        console.log(`End: ${endStamp.toString()}`);
        clearInterval(timer);
      }
    }, this.calcWPM(wpmSpeed, wordsPerBlock)); */
  }

  // resets the App to default values
  resetReader() {
    this.setState((state) => {
      return {
        // text: defaultText,
        currentBlock: 0,
        displayText: state.blockGroup[0].props.text,
        blockGroup: this.convertText(0, state.text, state.wordsPerBlock),
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });
    this.wordCounter();
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
      const blocks = this.convertText(0, state.text, parseInt(e.target.innerText));
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
        blockGroup: this.convertText(0, state.text, state.wordsPerBlock),
        displayText: state.blockGroup[0].props.text,
        isStarted: false,
        wpmSpeed: parseInt(e.target.innerText)
      };
    });
    this.resetTime();
  }
  
  // toggles the fullscreen state of the preview or block view
  toggleFullScreen (e) {
    // console.log(e.target.id);
    if(e.target.id == 'fullBlock') {
      this.setState({
        fullBlock: !this.state.fullBlock
      })
    } else if(e.target.id == 'fullPreview') {
      this.setState({
        fullPreview: !this.state.fullPreview
      })
    }
  }
  
  // counts the number of words in the current text state
  wordCounter() {
    this.setState((state) => {
      const arr = state.text.split(/\s/);
      let newArr = [];
      
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== "") {
          newArr.push(arr[i]);
        }
      }
      return {
        wordCount: newArr.length
      };
    });
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
        blockGroup: this.convertText(state.currentBlock, state.text, state.wordsPerBlock)
      };
    });
    this.wordCounter();
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
      fullBlock
    } = this.state;
    
    return (
      <div id="main-container">
        <textarea id="editor" onChange={this.handleChange} value={text} />
        
        <section id="preview"  className={fullPreview ? "fullScreen": "normal"}>
          {blockGroup}
          <div>
            <i id="fullPreview" className={"fas fa-expand"} onClick={this.toggleFullScreen}></i>
          </div>
        </section>
        
        <section id="block-view" className={fullBlock ? "fullScreen": "normal"}>
          <p>{displayText}</p>
          <i id="fullBlock" className="fas fa-expand" onClick={this.toggleFullScreen}></i>
        </section>
        
        <div id="wordCount">{`Word Count: ${this.state.wordCount}`}</div>
        
        <section id="input-view" className={(fullPreview || fullBlock) ? "lower": ""}>
          <button className="btn btn-light" onClick={this.startReader}>
            {isStarted ? "Pause" : "Start"}
          </button>
          <button className="btn btn-light" onClick={this.resetReader}>
            Reset
          </button>

          <div className="dropup">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              onClick={this.openBlockMenu}
            >
              Block Size {`(${wordsPerBlock})`}
            </button>
            <ul className={`dropdown-menu${blockMenuOpen ? " show" : ""}`}>
              <li className="dropdown-item" onClick={this.blockSizer}>
                1
              </li>
              <li className="dropdown-item" onClick={this.blockSizer}>
                2
              </li>
              <li className="dropdown-item" onClick={this.blockSizer}>
                3
              </li>
              <li className="dropdown-item" onClick={this.blockSizer}>
                4
              </li>
            </ul>
          </div>

          <div className="dropup">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              onClick={this.openWPMMenu}
            >
              WPM {`(${wpmSpeed})`}
            </button>
            <ul className={`dropdown-menu${wpmMenuOpen ? " show" : ""}`}>
              <li className="dropdown-item" onClick={this.wpmSelector}>
                100
              </li>
              <li className="dropdown-item" onClick={this.wpmSelector}>
                200
              </li>
              <li className="dropdown-item" onClick={this.wpmSelector}>
                300
              </li>
              <li className="dropdown-item" onClick={this.wpmSelector}>
                400
              </li>
            </ul>
          </div>
        </section>
      </div>
    );
  }
}

// component that renders each word block
const Block = (props) => {
  const handleClick = () => {
    props.handleClick(props.id, props.text);
  };

  return (
    <div
      id="textBlock"
      className={props.isSelected ? "isActive" : ""}
      onClick={handleClick}
    >
      {props.text}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
