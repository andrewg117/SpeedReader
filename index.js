const defaultText = 'Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time.';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    
    this.state = {
      text: defaultText,
      blockGroup: [],
      currentBlock: 0,
      displayText: 'Load Text'
    };
  }
  
  handleChange(e) {
    this.setState({
      text: e.target.value,
      blockGroup: this.convetText().map((text, index) => (
        <Block 
          key={index}
          text={text}
          />
      )),
      displayText: this.state.blockGroup[this.state.currentBlock].props.text
    });
  }
  
  
  handleClick(id, value) {
    this.setState({
      displayText: value
    });
  }
  
  
  convetText() {
    const arr = this.state.text.split(' ');
    return arr;
  }
  
  componentDidMount() {
    this.setState({
      blockGroup: this.convetText().map((text, index) => (
        <Block 
          key={index}
          text={text}
          handleClick={this.handleClick}
          />
      ))
      // displayText: this.state.blockGroup[this.state.currentBlock].props.text
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
      </div>
      )
  }
}

class Block extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isSelected: false
    };
  }
  
  // will change to selecting only one at a time
  handleClick(e) {
    this.props.handleClick(this.props.key, this.props.text);
    
    this.setState({
      isSelected: true
    });
  }
  
  render() {
    return (
        <div id="textBlock" class={this.state.isSelected ? "isActive" : ""} onClick={this.handleClick}>{this.props.text}</div>
      )
  }
}

ReactDOM.render(<App />, document.getElementById("root"));