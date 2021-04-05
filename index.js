const defaultText =
  "Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time.";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resetReader = this.resetReader.bind(this);
    this.openBlockMenu = this.openBlockMenu.bind(this);
    this.blockSizer = this.blockSizer.bind(this);

    this.state = {
      text: defaultText,
      blockGroup: [],
      currentBlock: 0,
      displayText: "Load Text",
      wordsPerBlock: 1,
      blockMenuOpen: false
    };
  }

  handleChange(e) {
    e.preventDefault();
    this.setState((state) => {
      return {
        text: e.target.value,
        currentBlock: 0,
        blockGroup: this.convetText(state.currentBlock, state.text),
        displayText: state.blockGroup[state.currentBlock].props.text
      }
    });
  }

  handleClick(id, value) {
    // console.log(`${id}`);
    this.setState((state) => {
      return {
        displayText: value,
        currentBlock: id,
        blockGroup: this.convetText(id, state.text)
      }
    });
  }

  convetText(selectedID, text) {
    const arr = text.split(" ");
    let temp = [];
    let wordLen = this.state.wordsPerBlock;
    
    for (let i = 0; i < arr.length; i+=wordLen){
      temp.push(arr.slice(i, i + wordLen).join(" "));
    }
    
    const newArr = temp.map((text, i) => {
      if(selectedID == i){
        return <Block key={i} id={i} text={text} handleClick={this.handleClick} isSelected={true} />
      }
        return <Block key={i} id={i} text={text} handleClick={this.handleClick} isSelected={false} />
      }
    );
    return newArr;
  }
  
  resetReader() {
    this.setState((state) => {
      return {
        text: defaultText,
        currentBlock: 0,
        displayText: "Load Text",
        blockGroup: this.convetText(0, defaultText)
      }
    });
  }
  
  openBlockMenu() {
    this.setState((state) => {
      return {
        blockMenuOpen: !state.blockMenuOpen
      }
    });
  }
  
  blockSizer(e) {
    this.setState((state) => {
      return {
        blockMenuOpen: false,
        wordsPerBlock: parseInt(e.target.innerText),
        currentBlock: 0,
        blockGroup: this.convetText(0, state.text),
        displayText: state.blockGroup[0].props.text
      }
    });
  }

  componentDidMount() {
    this.setState((state) => {
      return {
        blockGroup: this.convetText(state.currentBlock, state.text)
      }
    });
  }

  render() {
    const { text, blockGroup, displayText, blockMenuOpen, wordsPerBlock } = this.state;
    return (
      <div id="main-container">
        <textarea
          id="editor"
          onChange={this.handleChange}
          value={text}
        />
        <section id="preview">{blockGroup}</section>
        <section id="block-view">
          <h1>{displayText}</h1>
        </section>
        <section id="input-view">
          <button className="btn btn-light">Start</button>
          <button className="btn btn-light" onClick={this.resetReader}>Reset</button>
          
           <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              onClick={this.openBlockMenu}>
              Block Size {`(${wordsPerBlock})`}
            </button>
            <ul className={`dropdown-menu${blockMenuOpen ? " show": ""}`}>
               <li className="dropdown-item" 
                 onClick={this.blockSizer}>1</li>
               <li className="dropdown-item" 
                 onClick={this.blockSizer}>2</li>
               <li className="dropdown-item" 
                 onClick={this.blockSizer}>3</li>
               <li className="dropdown-item" 
                 onClick={this.blockSizer}>4</li>
            </ul>
          </div> 
        </section>
      </div>
    );
  }
}

const Block = (props) => {
  const handleClick = (e) => {
    e.preventDefault();
    props.handleClick(props.id, props.text);
  }

  return (
    <div
      id="textBlock"
      className={props.isSelected ? "isActive" : ""}
      onClick={handleClick}
      >
      {props.text}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
