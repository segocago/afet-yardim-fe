import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
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
            Afet Yardımı, Güneyoğu depreminden etkilenen insanlara gerekecek
            insani yardım toplama noktalarını, yardım noktalarının ihtiyaç
            durumlarını ve son güncel durumları hakkında notlar içerir.
          </div>
          <br />
          <div className="desc-text">
            Haritada işaretli olan pin noktalarına tıklayarak son yardım noktası
            hakkında bilgi alabilir, güncel durumu hakkında yeni not
            girebilirsiniz.
          </div>
          <br />
          <div className="desc-text">
            Haritaya yeni yardım noktası eklemek için sağ tıklayabilir, mobil
            cihazlar için ise ekrana basılı tutabilirsiniz.
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
