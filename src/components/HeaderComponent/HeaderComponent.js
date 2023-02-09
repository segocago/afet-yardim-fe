import React, { Component } from "react";
import "./HeaderComponent.css";
import { Button } from "@mui/material";
import OnboardingDialog from "../OnboardingDialog/OnboardingDialog";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { onboardingDialogOpen: false };
  }

  handleOnboardingDialogClose = () => {
    this.setState({ onboardingDialogOpen: false });
  };

  render() {
    return (
      <div>
        <header>
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="navbar-wrapper">
              <div className="navbar-brand">
                Deprem Yardımı Toplama Alanları
              </div>
              <OnboardingDialog
                open={this.state.onboardingDialogOpen}
                handleClose={this.handleOnboardingDialogClose}
                showClosestSiteButton={false}
              />
              <Button
                className="about-btn"
                variant="outlined"
                onClick={() => this.setState({ onboardingDialogOpen: true })}
              >
                Hakkkında
              </Button>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default HeaderComponent;
