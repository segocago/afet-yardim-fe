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
  Backdrop,
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
      invalidValues.push("Yardım noktası ismi");
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

  render() {
    const { handleInputChange } = this;
    return (
      <>
        <Dialog open={this.props.open} onClose={this.props.handleClose}>
          {
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={this.state.isSiteProcessing}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          }
          <DialogTitle>Yeni Yardım Noktası Yarat</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Yardım noktası ismi"
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
              label="Organize eden"
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
              onChange={this.handleCityInputChange}
              value={this.state.formValues.city}
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
              value={this.props.latitude}
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
              value={this.props.longitude}
              required
              disabled
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleConfirmSiteCreation()}>
              Yarat
            </Button>
            <Button onClick={() => this.props.handleClose()}>İptal</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default CreateSiteDialog;
