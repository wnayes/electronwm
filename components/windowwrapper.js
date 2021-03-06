const React = require("react");
const ReactDOM = require("react-dom");

const TitleBar = require("./titlebar.js");

class WindowWrapper extends React.Component {
  render() {
    const window = this.props.window;
    const divStyle = {
      //left: (window.x - 5) + "px",
      //top: (window.y - 15) + "px",
      width: (window.width) + "px",
      height: (window.height) + "px",
    };

    let className = "winWrapper";
    if (window.focused) {
      className += " focused";
    }

    let titlebar;
    if (window.decorated) {
      titlebar = (
        <TitleBar window={window} />
      );
    }

    return (
      <div className={className}>
        {titlebar}
        <div className="winBox" style={divStyle} ref={(div) => { this.winBox = div; }}></div>
      </div>
    );
  }

  componentDidMount() {
    //console.log("WindowWrapper.componentDidMount");
    this.adjustPosition();
  }

  componentDidUpdate() {
    //console.log("WindowWrapper.componentDidUpdate");
    this.adjustPosition();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldWindow = this.props.window;
    const newWindow = nextProps.window;

    if (oldWindow.title !== newWindow.title)
      return true;
    if (oldWindow.focused !== newWindow.focused)
      return true;

    if (oldWindow.width !== newWindow.width || oldWindow.height !== newWindow.height)
      this.adjustSize(newWindow);

    if (oldWindow.x !== newWindow.x || oldWindow.y !== newWindow.y)
      this.adjustPosition(newWindow);

    return false;
  }

  adjustSize(window = this.props.window) {
    let box = this.winBox;

    box.style.width = (window.width) + "px";
    box.style.height = (window.height) + "px";
  }

  adjustPosition(window = this.props.window) {
    let wrapper = ReactDOM.findDOMNode(this);
    let box = this.winBox;

    if (this.__leftAdjust === undefined) {
      let wrapperStyle = getComputedStyle(wrapper);
      this.__leftAdjust = box.offsetLeft + parseInt(wrapperStyle.borderLeftWidth);
      this.__topAdjust = box.offsetTop + parseInt(wrapperStyle.borderTopWidth);
    }

    // Adjust the positioning of the wrapper to account for titlebar, borders, etc.
    wrapper.style.left = (window.x - this.__leftAdjust) + "px";
    wrapper.style.top = (window.y - this.__topAdjust) + "px";
  }
}

module.exports = WindowWrapper;