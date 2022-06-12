import React from "react";
import Comp1 from "./comp-1";

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.inp1 = React.createRef();
    this.inp2 = React.createRef();
    this.hideButton = React.createRef();
    this.lblShowTime = React.createRef();
    this.state = { bg: this.props.color, x: 0, y: 0, msg: "Hello World!", show: true }
  }

  componentDidMount() {
    setInterval(this.onTimerX, 500);
    setInterval(this.onTimerY, 700);
  }

  comp1WillUnmount = (t) => {
    this.lblShowTime.current.innerText = (t === 0 ? "" : "Component was shown for " + t + " seconds")
  }

  onTimerX = () => {
    this.setState({ x: this.state.x + 1 }, () => { })
  }

  onTimerY = () => {
    this.setState({ y: this.state.y + 1 })
  }

  inputChanged = (e) => {
    this.setState({ bg: e.target.value, msg: this.inp1.current.value })
    if (this.Comp1)
      this.Comp1.color = e.target.value;
  }

  buttonClicked = () => {
    this.setState({ bg: this.inp2.current.value, x: 0, y: 0 })
  }

  hideClicked = () => {
    this.hideButton.current.innerText = (!this.state.show ? "Hide" : "Show")
    this.setState({ show: !this.state.show })
  }

  render() {
    //console.log("render " + this.state.bg);
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ backgroundColor: this.state.bg, height: 100, width: "60%" }}>
          <strong>{this.state.msg} - {this.state.x} - {this.state.y}</strong><br />
          <input ref={this.inp1} onChange={this.inputChanged} /><br />
          <input ref={this.inp2} />
          <button onClick={this.buttonClicked} > Change </button><br />
          <button ref={this.hideButton} onClick={this.hideClicked}>Hide</button>
          <label ref={this.lblShowTime} > time here </label>
        </div>
        <div style={{ width: "40%" }}>
          {
            this.state.show &&
            <Comp1 compColor={this.state.bg} onUnmount={this.comp1WillUnmount} />
          }
        </div>
      </div>
    )
  }
}

