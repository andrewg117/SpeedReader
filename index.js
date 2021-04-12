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
    e.preventDefault();
    this.setState((state) => {
      return {
        text: e.target.value,
        currentBlock: 0,
        blockGroup: this.convetText(state.currentBlock, state.text),
        displayText: state.blockGroup[state.currentBlock].props.text,
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });
    this.wordCounter();
  }

  handleClick(id, value) {
    this.setState((state) => {
      return {
        displayText: value,
        currentBlock: id,
        blockGroup: this.convetText(id, state.text),
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });
  }

  convetText(selectedID, text) {
    const arr = text.split(/\s/);
    let temp = [];
    let wordLen = this.state.wordsPerBlock;

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
          blockGroup: this.convetText(nextBlock, text)
        });

        setTimeout(this.timeoutTimer, this.nextTime - new Date().getTime());
      } else {
        let endStamp = new Date();
        console.log(`End: ${endStamp.toString()}`);
        clearTimeout(this.timeoutTimer);
        this.currentTime = 0;
        this.nextTime = 0;
      }
    } else {
        clearTimeout(this.timeoutTimer);
        this.currentTime = 0;
        this.nextTime = 0;
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

    this.currentTime = 0;
    this.nextTime = 0;
    setTimeout(this.timeoutTimer, this.calcWPM(wpmSpeed, wordsPerBlock));

    /* let timer = setInterval(() => {
      const {
        isStarted,
        currentBlock,
        blockGroup,
        text
      } = this.state;
      const nextBlock = currentBlock + 1;

      if (isStarted && nextBlock < blockGroup.length) {
        this.setState({
          displayText: blockGroup[nextBlock].props.text,
          currentBlock: nextBlock,
          blockGroup: this.convetText(nextBlock, text)
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
        blockGroup: this.convetText(0, state.text),
        isStarted: false,
        wpmMenuOpen: false,
        blockMenuOpen: false
      };
    });
    this.wordCounter();
    clearTimeout(this.timeoutTimer);
    this.currentTime = 0;
    this.nextTime = 0;
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
      return {
        wpmMenuOpen: false,
        blockMenuOpen: false,
        wordsPerBlock: parseInt(e.target.innerText),
        currentBlock: 0,
        blockGroup: this.convetText(0, state.text),
        displayText: state.blockGroup[0].props.text,
        isStarted: false,
        wpmSpeed: state.wpmSpeed
      };
    });
    clearTimeout(this.timeoutTimer);
    this.currentTime = 0;
    this.nextTime = 0;
  }

  wpmSelector(e) {
    this.setState((state) => {
      return {
        wpmMenuOpen: false,
        currentBlock: 0,
        blockGroup: this.convetText(0, state.text),
        displayText: state.blockGroup[0].props.text,
        isStarted: false,
        wpmSpeed: parseInt(e.target.innerText)
      };
    });
    clearTimeout(this.timeoutTimer);
    this.currentTime = 0;
    this.nextTime = 0;
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
      return {
        wordCount: state.blockGroup.length
      };
    });
  }

  componentDidMount() {
    this.setState((state) => {
      return {
        blockGroup: this.convetText(state.currentBlock, state.text)
      };
    });
    this.wordCounter();
  }
  
  componentWillUnmount() {
    this.setState({
      blockGroup: []
    });
    
    clearTimeout(this.timeoutTimer);
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
        <section id="input-view">
          <button className="btn btn-light" onClick={this.startReader}>
            {isStarted ? "Pause" : "Start"}
          </button>
          <button className="btn btn-light" onClick={this.resetReader}>
            Reset
          </button>

          <div className="dropdown">
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

          <div className="dropdown">
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
