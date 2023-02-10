import React, { Component } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Backdrop, RadioGroup, FormControlLabel, Radio,
} from "@mui/material";
import siteService from "../services/SiteService";
import { CITIES } from "../constants/constants";

class CreateSiteDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { formValues: {}, isSiteProcessing: false };
  }

  handleCityInputChange = (event, newValue) => {
    const { formValues } = this.state;
    this.setState({ formValues: { ...formValues, city: newValue.label } });
  };

  handleTypeInputChange = (event, newValue) => {
    const { formValues } = this.state;
    this.setState({ formValues: { ...formValues, type: newValue } });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    const { formValues } = this.state;
    this.setState({ formValues: { ...formValues, [name]: value } });
  };

  handleConfirmSiteCreation = async () => {
    const { handleClose, onNewSiteCreated } = this.props;
    const { formValues } = this.state;
    const { constructCreateSitePayload } = this;

    const invalidValues = this.validateFields(formValues);

    if (invalidValues.length > 0) {
      alert("Şu alanların doldurulması zorunludur: " + invalidValues);
      return;
    }
    this.setState({ isSiteProcessing: true });
    const response = await siteService.createSite(
      constructCreateSitePayload(formValues)
    );

    this.setState({ isSiteProcessing: false });

    onNewSiteCreated(response.data);
    handleClose();
  };

  constructCreateSitePayload = (formValues) => {
    return {
      name: formValues.name,
      organizer: formValues.organizer,
      location: {
        city: formValues.city,
        district: formValues.district,
        additionalAddress: formValues.additionalAddress,
        latitude: parseFloat(this.props.latitude),
        longitude: parseFloat(this.props.longitude),
      },
      description: formValues.description,
      contactInformation: formValues.contactInformation,
    };
  };

  validateFields = (formValues) => {
    let invalidValues = [];
    if (formValues.name == undefined) {
      invalidValues.push(formValues.type === "SHELTER" ? "Konaklama Noktası İsmi" : "Yardım Noktası İsmi");
    }

    if (formValues.city == undefined) {
      invalidValues.push("Şehir");
    }

    if (formValues.district == undefined) {
      invalidValues.push("İlçe");
    }

    if (formValues.additionalAddress == undefined) {
      invalidValues.push("Adres");
    }

    return invalidValues;
  };

  getNameLabel = () => {
    const { formValues } = this.state;
    return formValues.type === "SHELTER" ? "Konaklama Noktası İsmi" : "Yardım Noktası İsmi";
  }

  getOrganizerLabel = () => {
    const { formValues } = this.state;
    return formValues.type === "SHELTER" ? "Ev Sahibi İsmi" : "Organize Eden Kurum";
  }

  getDialogTitle = () => {
    const { formValues } = this.state;
    return formValues.type === "SHELTER" ? "Yeni Konaklama Noktası Ekle" : "Yeni Yardım Noktası Ekle";
  }

  render() {
    const { handleInputChange, handleConfirmSiteCreation, handleTypeInputChange, getNameLabel, getDialogTitle, getOrganizerLabel, handleCityInputChange } = this;
    const { formValues, isSiteProcessing } = this.state;
    const { latitude, longitude, handleClose } = this.props;

    return (
      <>
        <Dialog open={this.props.open} onClose={this.props.handleClose}>
          {
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isSiteProcessing}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          }
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogContent>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                defaultValue="SUPPLY"
                value={formValues.type}
                onChange={handleTypeInputChange}
                row
            >
              <FormControlLabel value="SUPPLY" control={<Radio />} label="Yardım Toplama Noktası" />
              <FormControlLabel value="SHELTER" control={<Radio />} label="Konaklama Noktası" />
            </RadioGroup>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label={getNameLabel()}
              type="text"
              fullWidth
              variant="standard"
              required
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              name="description"
              label="Açıklama"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="contactInformation"
              name="contactInformation"
              label="İletişim Bilgileri"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="organizer"
              name="organizer"
              label={getOrganizerLabel()}
              type="text"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
            />
            <Autocomplete
              style={{ marginTop: 15 }}
              disablePortal
              options={CITIES}
              renderInput={(params) => <TextField {...params} label="Şehir" />}
              onChange={handleCityInputChange}
              value={formValues.city}
            />
            <TextField
              autoFocus
              margin="dense"
              id="district"
              name="district"
              label="İlçe"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
              required
            />
            <TextField
              autoFocus
              margin="dense"
              id="additionalAddress"
              name="additionalAddress"
              label="Adres"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
              required
            />
            <TextField
              autoFocus
              margin="dense"
              id="latitude"
              name="latitude"
              label="Enlem"
              type="number"
              fullWidth
              variant="standard"
              value={latitude}
              required
              disabled
            />
            <TextField
              autoFocus
              margin="dense"
              id="longitude"
              name="longitude"
              label="Boylam"
              type="number"
              fullWidth
              variant="standard"
              value={longitude}
              required
              disabled
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleConfirmSiteCreation()}>
              Ekle
            </Button>
            <Button onClick={() => handleClose()}>İptal</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default CreateSiteDialog;
