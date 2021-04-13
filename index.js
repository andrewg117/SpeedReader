const defaultText =
  "Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time. Default text to use in the project for word count and speed testing. It will, of course, change over time.";

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

  // this is a temp calculation of WPM using the js timer.. still researching
  /* 
      After testing using timestamps in the startReader function, it seems to be 2 seconds off. This could be due to the delay at the start. I'll work on reducing the startup time.

      After researching, I found that both setTimeout and setInterval accuracy drifts increasingly every interval. I decided to use setTimeout's recursive solution to solve the drift.
      REF:  https://www.sitepoint.com/creating-accurate-timers-in-javascript/ by James Edwards
            https://stackoverflow.com/questions/8173580/setinterval-timing-slowly-drifts-away-from-staying-accurate by Alex Wayne
  */
  calcWPM(wpm, block) {
    const calc = (60 / wpm) * 1000 * block;
    return calc;
  }

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

  openBlockMenu() {
    this.setState((state) => {
      return {
        blockMenuOpen: !state.blockMenuOpen,
        wpmMenuOpen: false
      };
    });
  }

  openWPMMenu() {
    this.setState((state) => {
      return {
        wpmMenuOpen: !state.wpmMenuOpen,
        blockMenuOpen: false
      };
    });
  }

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
  
  resetTime() {
    clearTimeout(this.timeoutTimer);
    this.currentTime = 0;
    this.nextTime = 0;
  }

  componentDidMount() {
    this.setState((state) => {
      return {
        blockGroup: this.convertText(state.currentBlock, state.text, state.wordsPerBlock)
      };
    });
    this.wordCounter();
  }
  
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
