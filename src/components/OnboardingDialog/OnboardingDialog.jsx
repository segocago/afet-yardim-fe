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
          <div className="title">Nasıl Kullanılır</div>
        </DialogTitle>
        <DialogContent>
          <div className="desc-text">
            <InsertCommentTwoToneIcon></InsertCommentTwoToneIcon> Haritada işaretli olan pin noktalarına tıklayarak son yardım noktası
            hakkında bilgi alabilir, güncel durumu hakkında yeni not
            girebilirsiniz.
          </div>
          <br />
          <div className="desc-text">
            <AddLocationAltTwoToneIcon></AddLocationAltTwoToneIcon>
            <b>Haritaya yeni yardım noktası eklemek için bilgisayarda sağ tıklayabilir, mobil
              cihazlar için ise ekrana basılı tutabilirsiniz.</b>
          </div>
          <br />
          <div className="desc-text">
            <WarningTwoToneIcon> </WarningTwoToneIcon>Yardım alanlarını görmek istediğiniz ili sol üstteki menüden seçin.
          </div>
          <br />
          {this.props.showClosestSiteButton &&
              <Button onClick={() => navigator.geolocation.getCurrentPosition(this.onGetUserLocation, this.onFailedToGetUserLocation)}
              >Bana en yakın yardım noktasını göster</Button>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.handleClose()}>Anladım</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default OnboardingDialog;
