import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Button, CardMedia, Grid, TextField } from "@mui/material";
import { getDistance } from "geolib";
import React, { useEffect, useState } from "react";
import { CITIES } from "../../constants/constants";
import SiteService from "../../services/SiteService";
import ClosestHelpSiteButton from "../ClosestHelpSiteButton";
import CreateSiteDialog from "../CreateSiteDialog";
import Map from "../Map";
import OnboardingDialog from "../OnboardingDialog/OnboardingDialog";
import { foodImage, humanImage, materialImage, noNeedOrClosedImaged, packageImage, unknownImage } from "../img/images";
import {
  doesSiteNeedAnyHelp
} from "../utils/SiteUtils";
import "./MainPage.css";

const SCREEN_WIDTH = window.screen.width;

// Move map to a bit north of closest site so that the popup dialog for marker shows correctlyg
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
        <ClosestHelpSiteButton
          sites={sites}
          mapRef={mapRef}
          callback={() => setOnboardingDialogOpen(false)}
        >
          BANA EN YAKIN YARDIM ALANINI GÖSTER
        </ClosestHelpSiteButton>
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
          showClosestSiteButton={true}
          handleSelectCity={setSelectedCity}
          selectedCity={selectedCity}
          sites={sites}
          mapRef={mapRef}
        /> 
      {/*Disabled site creation dialog, only feed the system from spreadsheets*/}
      <CreateSiteDialog
        open={false}
        handleClose={handleCreateSiteDialogClose}
        latitude={lastClickedLatitude}
        longitude={lastClickedLongitude}
        onNewSiteCreated={onNewSiteCreated}
      />
      <Grid style={{padding: (7, 14, 0, 14), backgroundColor: 'rgba(255, 255, 255, 0.3)', display: "flex", justifyContent: "space-between" }} container spacing={1} className="map-legend">
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
