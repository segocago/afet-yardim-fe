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
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import InsertCommentTwoToneIcon from '@mui/icons-material/InsertCommentTwoTone';
import "./OnboardingDialog.css";

class OnboardingDialog extends Component {
  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogTitle>
          <div className="title">Deprem Yardım Noktaları Hakkında</div>
        </DialogTitle>
        <DialogContent>
          <div className="desc-text">
            <InfoTwoToneIcon> </InfoTwoToneIcon> Afet Yardımı, Güneyoğu depreminden etkilenen insanlara gerekecek
            insani yardım toplama noktalarını, yardım noktalarının ihtiyaç
            durumlarını ve son güncel durumları hakkında notlar içerir.
          </div>
          <br />
          <div className="desc-text">
            <WarningTwoToneIcon> </WarningTwoToneIcon>Yardım alanlarını görmek istediğiniz ili sol üstteki menüden seçin.
          </div>
          <br />
          <div className="desc-text">
            <InsertCommentTwoToneIcon></InsertCommentTwoToneIcon> Haritada işaretli olan pin noktalarına tıklayarak son yardım noktası
            hakkında bilgi alabilir, güncel durumu hakkında yeni not
            girebilirsiniz.
          </div>
          <br />
          <div className="desc-text">
            <AddLocationAltTwoToneIcon></AddLocationAltTwoToneIcon>
            <b>Haritaya yeni yardım noktası eklemek için sağ tıklayabilir, mobil
              cihazlar için ise ekrana basılı tutabilirsiniz.</b>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.handleClose()}>Anladım</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default OnboardingDialog;
