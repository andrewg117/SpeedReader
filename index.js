const defaultText = 'Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course, change over time .Default text to use in the project. It will, of course, change over time. Default text to use in the project. It will, of course change over time.';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      text: defaultText,
      blockGroup: []
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
      ))
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
          />
      ))
    });
  }
  
  render() {
    return (
      <div id="mark-container">
        <textarea
          id="editor"
          onChange={this.handleChange}
          value={this.state.text}
        />
        <div id="preview">{this.state.blockGroup}</div>
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
  handleClick() {
    this.setState({
      isSelected: !this.state.isSelected
    });
  }
  
  render() {
    return (
        <div id="textBlock" class={this.state.isSelected ? "isActive" : ""} onClick={this.handleClick}>{this.props.text}</div>
      )
  }
}

ReactDOM.render(<App />, document.getElementById("root"));