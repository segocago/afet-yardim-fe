import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Stack, TextField,
} from "@mui/material";
import { CITIES } from "../../constants/constants";
import ClosestHelpSiteButton from '../ClosestHelpSiteButton';
import "./OnboardingDialog.css";

const OnboardingDialog = ({open, handleClose, setOnboardingDialogOpen, showClosestSiteButton, handleSelectCity, selectedCity, sites, mapRef}) => {
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
            console.log("Here")
          }}
          value={selectedCity}
      />}
      <DialogContent>
      {showClosestSiteButton && selectedCity &&
        <Stack spacing={2}>
          <p>
          Haritadaki veriler seçilen illerdeki yardım organizasyon gruplarının kullandıkları spreadsheetlerden 
          güncellenmektedir. Bu organizasyonlardaki arkadaşlar ellerinden geldikçe çok güncelleme girmeye çalışsalar da
           her lokasyon için her zaman güncel veri bulunmayabilir. Gitmeyi planladığınız alanın son güncellenme 
           tarihini kontrol etmeyi unutmayın.
          </p>
        </Stack>
      }
      </DialogContent>
      <DialogActions>
        <Button disabled={!selectedCity} onClick={() => handleClose()}>{selectedCity && "Kapat"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default OnboardingDialog;
