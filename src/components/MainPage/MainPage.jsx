import React, { Component } from "react";
import "./MainPage.css";
import Map from "../Map";
import { Autocomplete, TextField, Button, Tooltip } from "@mui/material";
import SiteService from "../../services/SiteService";
import { CITIES } from "../../constants/constants";
import CreateSiteDialog from "../CreateSiteDialog";
import OnboardingDialog from "../OnboardingDialog/OnboardingDialog";
import { getDistance } from "geolib";

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCity: CITIES.find((city) => city.label === "Ankara"),
      sites: [],
      centerLocation: [39.909442, 32.810491],
      createSiteDialogOpen: false,
      onboardingDialogOpen: true,
      lastClickedLatitude: null,
      lastClickedLongitude: null,
      mapRef: null,
    };
  }

  handleSelectCity = (event, newValue) => {
    const lat = parseFloat(newValue.latitude);
    const lon = parseFloat(newValue.longitude);
    this.setState({ selectedCity: newValue, centerLocation: [lat, lon] });
  };

  componentDidMount() {
    SiteService.getSites(this.state.selectedCity.label).then((res) => {
      this.setState({ sites: res.data });
    });
  }

  handleCreateSiteDialogOpen = (e) => {
    const { lat, lng } = e.latlng;
    this.setState({
      createSiteDialogOpen: true,
      lastClickedLatitude: lat,
      lastClickedLongitude: lng,
    });
  };

  handleCreateSiteDialogClose = (formValues) => {
    console.log(formValues);
    this.setState({ createSiteDialogOpen: false });
  };

  handleOnboardingDialogClose = () => {
    this.setState({ onboardingDialogOpen: false });
  };

  onNewSiteCreated = (newSite) => {
    this.setState({ sites: [...this.state.sites, newSite] });
  };

  addCommentToSite = (event, siteId) => {
    event.preventDefault();
    let comment = {};

    comment.update = event.target[0].value;

    if (
      event.target[0].value === undefined ||
      event.target[0].value === null ||
      event.target[0].value.trim().length === 0
    ) {
      alert("Boş yorum eklenemenez.");
      return;
    }

    const { sites } = this.state;
    SiteService.addCommentToSite(siteId, comment).then((res) => {
      let updatedSites = sites.map((site) => {
        if (site.id === siteId) {
          return res.data;
        }
        return site;
      });
      this.setState({ sites: updatedSites });
    });
  };

  handleShowMeClosestSite = (lat, long) => {
    const { sites, mapRef } = this.state;

    if (!sites || sites.length === 0) {
      alert("Yardım toplama noktası bulunamadı");
      return;
    }
    let minDistance = Number.MAX_SAFE_INTEGER;
    let closestSite = sites[0];

    sites.forEach((site) => {
      if (site.location && site.location.latitude && site.location.longitude) {
        const distance = getDistance(
          { latitude: lat, longitude: long },
          {
            latitude: site.location.latitude,
            longitude: site.location.longitude,
          }
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestSite = site;
        }
      }
    });
    mapRef.setView(
      [closestSite.location.latitude, closestSite.location.longitude],
      16
    );
    closestSite.markerRef.openPopup();
    this.setState({ onboardingDialogOpen: false });
  };
  whenMapReady = (event) => {
    this.setState({ mapRef: event.target });
  };

  onGetUserLocation = (position) => {
    this.props.handleShowMeClosestSite(
      position.coords.latitude,
      position.coords.longitude
    );
  };

  onFailedToGetUserLocation = (error) => {
    alert(
      "En yakın yardım alanını bulabilmek için uygulamaya konum erişim izni vermeniz gerekiyor."
    );
  };

  render() {
    return (
      <div>
        <div className="button-group">
          <Autocomplete
            style={{ marginTop: 15, width: "30%" }}
            disablePortal
            options={CITIES}
            renderInput={(params) => <TextField {...params} label="Şehir" />}
            onChange={this.handleSelectCity}
            value={this.state.selectedCity}
          />
          <Button
            variant="contained"
            onClick={() =>
              navigator.geolocation.getCurrentPosition(
                this.onGetUserLocation,
                this.onFailedToGetUserLocation
              )
            }
          >
            BANA EN YAKIN YARDIM NOKTASINI GÖSTER
          </Button>
          <Tooltip title="Haritaya sağ tıklayarak veya mobil cihazlarda ekrana basılı tutarak yeni yardım noktası ekleyebilirsiniz">
            <Button variant="contained">YENİ YARDIM NOKTASI EKLE</Button>
          </Tooltip>
        </div>

        <Map
          whenMapReady={this.whenMapReady}
          sites={this.state.sites}
          center={this.state.centerLocation}
          addCommentToSite={this.addCommentToSite}
          handleCreateSiteDialogOpen={this.handleCreateSiteDialogOpen}
        ></Map>
        <OnboardingDialog
          open={this.state.onboardingDialogOpen}
          handleShowMeClosestSite={this.handleShowMeClosestSite}
          handleClose={this.handleOnboardingDialogClose}
          showClosestSiteButton={true}
        />
        <CreateSiteDialog
          open={this.state.createSiteDialogOpen}
          handleClose={this.handleCreateSiteDialogClose}
          latitude={this.state.lastClickedLatitude}
          longitude={this.state.lastClickedLongitude}
          onNewSiteCreated={this.onNewSiteCreated}
        />
      </div>
    );
  }
}

export default MainPage;
