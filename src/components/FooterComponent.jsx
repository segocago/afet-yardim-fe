import React, { Component } from "react";

class FooterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <footer className="footer">
          <span className="text-muted">Made by Bro's Jr with ❤️</span>
          {/* <div className="text-muted">Contribute</div> */}
          <div>
            <span> Help us on</span>
            <a
              href="https://github.com/segocago/afet-yardim-fe"
              rel="noreferrer"
              target="_blank"
            >
              {" FE "}
            </a>
            <span> or on </span>
            <a
              href="https://github.com/segocago/afet-yardim-be"
              rel="noreferrer"
              target="_blank"
            >
              {" BE"}
            </a>
            <span className="">!</span>
          </div>
        </footer>
      </div>
    );
  }
}

export default FooterComponent;
