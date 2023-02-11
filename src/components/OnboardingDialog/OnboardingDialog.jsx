import React from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, TextField,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import "./OnboardingDialog.css";
import {CITIES} from "../../constants/constants";

const OnboardingDialog = ({open, handleClose, showClosestSiteButton, handleSelectCity, selectedCity}) => {
  const onGetUserLocation = (position) => {
    this.props.handleShowMeClosestSite(position.coords.latitude, position.coords.longitude);
  }

  const onFailedToGetUserLocation = (error) => {
    alert("En yakın yardım alanını bulabilmek için uygulamaya konum erişim izni vermeniz gerekiyor.")
  }

  return (
    <Dialog disableEscapeKeyDown={selectedCity != null} open={open} onClose={handleClose}>
      <DialogTitle>
        <div className="title">{selectedCity ? "En Yakın Yardım Alanı" : "İlerlemek İçin Şehir Seçiniz"}</div>
      </DialogTitle>
      {!selectedCity && <Autocomplete
          className="auto-complete-dropdown"
          style={{width: "100%"}}
          options={CITIES}
          renderInput={(params) => <TextField {...params} label="Şehir"/>}
          onChange={(event, value) => {
            handleSelectCity(value);
          }}
          value={selectedCity}
      />}
      <DialogContent>
          {showClosestSiteButton && selectedCity &&
            <Button startIcon={<SendIcon/>} variant="contained" onClick={() => navigator.geolocation.getCurrentPosition(onGetUserLocation, onFailedToGetUserLocation)}
            > Bana En Yakın Yardım Alanını Göster</Button>}
      </DialogContent>
      <DialogActions>
        <Button disabled={!selectedCity} onClick={() => handleClose()}>{selectedCity && "Kapat"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default OnboardingDialog;
