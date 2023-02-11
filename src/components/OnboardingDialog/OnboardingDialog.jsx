import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import AddLocationAltTwoToneIcon from '@mui/icons-material/AddLocationAltTwoTone';
import InsertCommentTwoToneIcon from '@mui/icons-material/InsertCommentTwoTone';
import "./OnboardingDialog.css";


class OnboardingDialog extends Component {

  onGetUserLocation = (position) => {
    this.props.handleShowMeClosestSite(position.coords.latitude,position.coords.longitude);
  }

  onFailedToGetUserLocation = (error) => {

    alert("En yakın yardım alanını bulabilmek için uygulamaya konum erişim izni vermeniz gerekiyor.")
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogTitle>
          <div className="title">En Yakın Yardım Noktası</div>
        </DialogTitle>
        <DialogContent>
            {this.props.showClosestSiteButton &&
              <Button variant="contained" onClick={() => navigator.geolocation.getCurrentPosition(this.onGetUserLocation, this.onFailedToGetUserLocation)}
              >  BANA EN YAKIN YARDIM NOKTASINI GÖSTER </Button>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.handleClose()}>Kapat</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default OnboardingDialog;
