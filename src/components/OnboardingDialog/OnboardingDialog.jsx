import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, TextField,
} from "@mui/material";
import { CITIES } from "../../constants/constants";
import ClosestHelpSiteButton from '../ClosestHelpSiteButton';
import "./OnboardingDialog.css";

const OnboardingDialog = ({open, handleClose, showClosestSiteButton, handleSelectCity, selectedCity, sites, mapRef}) => {

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
          <ClosestHelpSiteButton
            sites={sites}
            mapRef={mapRef}
            callback={() => handleClose()}
          >
           Bana En Yakın Yardım Alanını Göster
          </ClosestHelpSiteButton>
        }
      </DialogContent>
      <DialogActions>
        <Button disabled={!selectedCity} onClick={() => handleClose()}>{selectedCity && "Kapat"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default OnboardingDialog;
