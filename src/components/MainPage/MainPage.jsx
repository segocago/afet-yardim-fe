import React, { useEffect, useState } from "react";
import "./MainPage.css";
import Map from "../Map";
import {Autocomplete, TextField, Button, CardMedia, Grid} from "@mui/material";
import SiteService from "../../services/SiteService";
import { CITIES } from "../../constants/constants";
import CreateSiteDialog from "../CreateSiteDialog";
import OnboardingDialog from "../OnboardingDialog/OnboardingDialog";
import { getDistance } from "geolib";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  doesSiteNeedAnyHelp
} from "../utils/SiteUtils";
import {foodImage, humanImage, materialImage, noNeedOrClosedImaged, packageImage, unknownImage} from "../img/images";

const SCREEN_WIDTH = window.screen.width;

const LEGEND_IMAGE_DIMENSION = 20;
const INITIAL_SELECTED_CITY = CITIES.find((city) => city.label === "Ankara");

const MainPage = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [sites, setSites] = useState([]);
  const [centerLocation, setCenterLocation] = useState([INITIAL_SELECTED_CITY.latitude, INITIAL_SELECTED_CITY.longitude]);
  const [setCreateSiteDialogOpen] = useState(false);
  const [onboardingDialogOpen, setOnboardingDialogOpen] = useState(true);
  const [lastClickedLatitude, setLastClickedLatitude] = useState(null);
  const [lastClickedLongitude, setLastClickedLongitude] = useState(null);
  const [minimizeHeader, setMinimizeHeader] = useState(false);
  const [mapRef, setMapRef] = useState(null);

  const setSelectedCityFromLocalStorage = () => {
    const selectedCityFromLocalStorage = JSON.parse(localStorage.getItem("selectedCity"));
    selectedCityFromLocalStorage ? setSelectedCity(selectedCityFromLocalStorage) : setSelectedCity(null);
  }
  const fetchSitesOfSelectedCity = () => {
    selectedCity && SiteService.getSites(selectedCity.label).then((res) => {
      setSites(res.data);
    });
  }
  const handleSelectCity = (newValue) => {
    const lat = parseFloat(newValue.latitude);
    const lon = parseFloat(newValue.longitude);
    setSelectedCity(newValue);

    const center = [lat, lon];
    if (center !== undefined) {
      setCenterLocation(center);
    }
  };

  useEffect(() => {
    fetchSitesOfSelectedCity(selectedCity);
    if (selectedCity) {
      localStorage.setItem("selectedCity", JSON.stringify(selectedCity));
      const center = [selectedCity.latitude, selectedCity.longitude];
      center && setCenterLocation(center);
    }
  }, [selectedCity]);

  useEffect(() => {
    setSelectedCityFromLocalStorage();
    fetchSitesOfSelectedCity(selectedCity);
  }, []);

  const handleCreateSiteDialogOpen = (lat, long) => {
    setCreateSiteDialogOpen(true);
    setLastClickedLatitude(lat);
    setLastClickedLongitude(long);
  };

  const handleCreateSiteDialogClose = (formValues) => {
    setCreateSiteDialogOpen(false);
  };

  const handleOnboardingDialogClose = (event, reason) => {
    if (!selectedCity && reason === "backdropClick") {
      return;
    }
    fetchSitesOfSelectedCity(selectedCity);
    setCenterLocation([selectedCity.latitude, selectedCity.longitude]);
    setOnboardingDialogOpen(false);
  };

  const onNewSiteCreated = (newSite) => {
    setSites([...sites, newSite]);
  };

  const addCommentToSite = (event, siteId, siteStatuses) => {
    event.preventDefault();
    let comment = {};

    if (
      event.target[0].value === undefined ||
      event.target[0].value === null ||
      event.target[0].value.trim().length === 0
    ) {
      alert("Boş yorum eklenemenez.");
      return;
    }

    comment.update = event.target[0].value;
    comment.siteStatuses = siteStatuses;

    SiteService.addCommentToSite(siteId, comment).then((res) => {
      let updatedSites = sites.map((site) => {
        if (site.id === siteId) {
          return res.data;
        }
        return site;
      });
      setSites(updatedSites);
    });
  };

  const whenMapReady = (event) => {
    setMapRef(event.target);
  };


  const handleShowMeClosestSite = (lat, long) => {
    if (!sites || sites.length === 0) {
      alert("Yardım toplama noktası bulunamadı");
      return;
    }
    let minDistance = Number.MAX_SAFE_INTEGER;
    let closestSite = sites[0];

    const helpRequiredSites = sites.filter(site => doesSiteNeedAnyHelp(site));

    helpRequiredSites.forEach((site) => {

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

    const latitudeToGo = closestSite.location.latitude;
    const longitudeToGo = closestSite.location.longitude;
    mapRef.setView(
      [latitudeToGo,longitudeToGo], 16);
    closestSite.markerRef.openPopup();
    setOnboardingDialogOpen(false);
  };

  const onGetUserLocation = (position) => {
    handleShowMeClosestSite(
      position.coords.latitude,
      position.coords.longitude
    );
  };

  const onFailedToGetUserLocation = (error) => {
    alert(
      "En yakın yardım alanını bulabilmek için uygulamaya konum erişim izni vermeniz gerekiyor."
    );
  };

  return (
    <div>
      <div
        className={minimizeHeader ? "button-group-minimize" : "button-group"}
      >
        <Autocomplete
          className="auto-complete-dropdown"
          style={{ width: "100%", marginRight: "15px" }}
          disablePortal
          options={CITIES}
          renderInput={(params) => <TextField {...params} label="Şehir" />}
          onChange={(event, value) => {
            handleSelectCity(value);
          }}
          value={selectedCity}
        />
        <Button
          variant="contained"
          onClick={() =>
            navigator.geolocation.getCurrentPosition(
              onGetUserLocation,
              onFailedToGetUserLocation
            )
          }
        > EN YAKIN YARDIM GEREKEN ALANI GÖSTER
        </Button>
        {SCREEN_WIDTH < 600 && (
          <div className="minimize-icon-cont">
            {!minimizeHeader ? (
              <KeyboardArrowUpIcon
                fontSize="large"
                onClick={() => setMinimizeHeader(true)}
              />
            ) : (
              <KeyboardArrowDownIcon
                fontSize="large"
                onClick={() => setMinimizeHeader(false)}
              />
            )}
          </div>
        )}
      </div>

      <Map
        whenMapReady={whenMapReady}
        sites={sites}
        center={centerLocation}
        addCommentToSite={addCommentToSite}
        handleCreateSiteDialogOpen={handleCreateSiteDialogOpen}
      ></Map>
      <OnboardingDialog
        open={onboardingDialogOpen}
        handleClose={handleOnboardingDialogClose}
        handleShowMeClosestSite={handleShowMeClosestSite}
        showClosestSiteButton={true}
        handleSelectCity={setSelectedCity}
        selectedCity={selectedCity}
      />

      {/*Disabled site creation dialog, only feed the system from spreadsheets*/}
      <CreateSiteDialog
        open={false}
        handleClose={handleCreateSiteDialogClose}
        latitude={lastClickedLatitude}
        longitude={lastClickedLongitude}
        onNewSiteCreated={onNewSiteCreated}
      />
      <Grid style={{paddingLeft: "12px", paddingBottom: "5px", background: "white", display: "flex", justifyContent: "space-between" }} container spacing={1} className="map-legend">
        <div>
          <CardMedia
            component="img"
            sx={{
              height: LEGEND_IMAGE_DIMENSION,
              width: LEGEND_IMAGE_DIMENSION
            }}
            src={humanImage}
        /> <b>İnsan</b>
        </div>

        <div><CardMedia
            component="img"
            sx={{
              height: LEGEND_IMAGE_DIMENSION,
              width: LEGEND_IMAGE_DIMENSION
            }}
            src={materialImage}
        /><b>Materyal</b>
        </div>

        <div>
        <CardMedia
            component="img"
            sx={{
              height: LEGEND_IMAGE_DIMENSION,
              width: LEGEND_IMAGE_DIMENSION
            }}
            src={foodImage}
        /><b>Gıda</b>
        </div>
        
        <div>
        <CardMedia
            component="img"
            sx={{
              height: LEGEND_IMAGE_DIMENSION,
              width: LEGEND_IMAGE_DIMENSION
            }}
            src={packageImage}
        /><b>Koli</b>
        </div>
        
        <div>
        <CardMedia
              component="img"
              sx={{
                  height: LEGEND_IMAGE_DIMENSION,
                  width: LEGEND_IMAGE_DIMENSION
              }}
              src={noNeedOrClosedImaged}
          /><b>Kapalı/Yardım Gerekmiyor</b>
        </div>
          
        <div>
        <CardMedia
              component="img"
              sx={{
                  height: LEGEND_IMAGE_DIMENSION,
                  width: LEGEND_IMAGE_DIMENSION
              }}
              src={unknownImage}
          /><b>Bilgi Yok</b>
        </div>
      </Grid>
    </div>
  );
};

export default MainPage;
