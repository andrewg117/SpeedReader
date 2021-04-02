const defaultText =
  "Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time.";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resetReader = this.resetReader.bind(this);

    this.state = {
      text: defaultText,
      blockGroup: [],
      currentBlock: 0,
      displayText: "Load Text"
    };
  }

  handleChange(e) {
    this.setState((state) => {
      return {
        text: e.target.value,
        currentBlock: 0,
        blockGroup: this.convetText(state.currentBlock),
        displayText: state.blockGroup[state.currentBlock].props.text
      }
    });
  }

  handleClick(id, value) {
        console.log(`${id}`);
    this.setState((state) => {
      return {
        displayText: value,
        currentBlock: id,
        blockGroup: this.convetText(id)
      }
    });
  }

  convetText(selectedID) {
    const arr = this.state.text.split(" ");
    const newArr = arr.map((text, i) => {
      if(selectedID == i){
        return <Block key={i} id={i} text={text} handleClick={this.handleClick} isSelected={true} />
      }
        return <Block key={i} id={i} text={text} handleClick={this.handleClick} isSelected={false} />
      }
    );
    return newArr;
  }
  
  resetReader() {
    this.setState({
      text: defaultText,
      currentBlock: 0,
      displayText: "Load Text",
      blockGroup: this.convetText(0)
    });
  }

  componentDidMount() {
    this.setState((state) => {
      return {
        blockGroup: this.convetText(state.currentBlock)
      }
    });
  }

  render() {
    return (
      <div id="main-container">
        <textarea
          id="editor"
          onChange={this.handleChange}
          value={this.state.text}
        />
        <section id="preview">{this.state.blockGroup}</section>
        <section id="block-view">
          <h1>{this.state.displayText}</h1>
        </section>
        <section id="input-view">
          <button className="btn btn-light">Start</button>
          <button className="btn btn-light" onClick={this.resetReader}>Reset</button>
          
          {/*  <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              data-toggle="dropdown">
              WPM
            </button>
            <ul className="dropdown-menu">
               <a className="dropdown-item" href="#">HTML</a>
               <a className="dropdown-item" href="#">HTML</a>
               <a className="dropdown-item" href="#">HTML</a>
               <a className="dropdown-item" href="#">HTML</a>
            </ul>
          </div> */}
        </section>
      </div>
    );
  }
}

class Block extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    // this.state = {
    //   isSelected: false
    // };
  }

  // will change to selecting only one at a time
  handleClick(e) {
    this.props.handleClick(this.props.id, this.props.text);

    // this.setState({
    //   isSelected: true
    // });
  }

  render() {
    return (
      <div
        id="textBlock"
        className={this.props.isSelected ? "isActive" : ""}
        onClick={this.handleClick}
      >
        {this.props.text}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
