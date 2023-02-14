import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { LoadingButton } from "@mui/lab";
import { Alert, Autocomplete, Button, CardMedia, Grid, Snackbar, TextField } from "@mui/material";
import { getDistance } from "geolib";
import queryString from 'query-string';
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

// Move map to a bit north of closest site so that the popup dialog for marker shows correctly
const LEGEND_IMAGE_DIMENSION = 20;
const INITIAL_SELECTED_CITY = CITIES.find((city) => city.label === "Ankara");

const MainPage = () => {
  /*
    Currently the supported queries are 'city' and 'siteId'. These information are enough
    to focus on a specific pin. In the future, new queries such as address, district, etc. 
    can be added. 
  */
  const parsedQuery = queryString.parse(window.location.search)
  const skipOnboarding = parsedQuery.city || parsedQuery.siteId 

  const [selectedCity, setSelectedCity] = useState(null);
  const [sites, setSites] = useState([]);
  const [centerLocation, setCenterLocation] = useState([INITIAL_SELECTED_CITY.latitude, INITIAL_SELECTED_CITY.longitude]);
  const [setCreateSiteDialogOpen] = useState(false);
  const [onboardingDialogOpen, setOnboardingDialogOpen] = useState(!skipOnboarding);
  const [lastClickedLatitude, setLastClickedLatitude] = useState(null);
  const [lastClickedLongitude, setLastClickedLongitude] = useState(null);
  const [minimizeHeader, setMinimizeHeader] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [errMsg, setErrMsg] = useState(null)

  const handleSetSelectedCity = (newCity) => {
    if (newCity) {
      window.history.pushState(null, '', `?city=${newCity.label}`)
      setSelectedCity(newCity)
      localStorage.setItem("selectedCity", JSON.stringify(newCity))
    }
  }
 
  const setSelectedCityFromLocalStorage = () => {
    const selectedCityFromLocalStorage = JSON.parse(localStorage.getItem("selectedCity"));
    selectedCityFromLocalStorage ? handleSetSelectedCity(selectedCityFromLocalStorage) : handleSetSelectedCity(null);
    return selectedCityFromLocalStorage
  }
  const fetchSitesOfSelectedCity = async (selectedCity) => {
    const res = await SiteService.getSites(selectedCity.label)
    setSites(res.data);
    return res.data
  };

  const handleInitFromLocalStorage = () => {
    const selectedCity = setSelectedCityFromLocalStorage()
    if (selectedCity) {
      fetchSitesOfSelectedCity(selectedCity);
      window.history.pushState(null, "", `/?city=${selectedCity.label}`)
    }
  }

  const handleInitFromSelectedCity = (selectedCity) => {
    fetchSitesOfSelectedCity(selectedCity);
    window.history.pushState(null, "", `/?city=${selectedCity.label}`)
  }

  const handleInitFromSelectedCityAndSiteId = (selectedCity, siteId) => {
    console.log('here')
    fetchSitesOfSelectedCity(selectedCity);
    window.history.pushState(null, "", `/?city=${selectedCity.label}&siteId=${siteId}`)
  }
  
  useEffect(() => {
    if (!skipOnboarding) {
      handleInitFromLocalStorage()
    }
  }, []);
  
  const handleSelectCity = async (newValue) => {
    if (newValue) {
      const lat = parseFloat(newValue.latitude);
      const lon = parseFloat(newValue.longitude);
      const center = [lat, lon];
      if (center[0] && center[1]) {
        setCenterLocation(center);
      } 
      else {
        setErrMsg(`${newValue.label} şehrinin koordinatlarında bir sorun var.`)
      }

      // Remove markers first to overcome issues regarding the URL queries. Otherwise, the default
      // behavior during the removal of the marker results in the URL being not updated
      sites.forEach((s) => s.markerRef.remove())

      //
      fetchSitesOfSelectedCity(newValue)
      handleSetSelectedCity(newValue);
    }
  };

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
      setErrMsg("Boş yorum eklenemenez.");
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
    
    const handleQueryRedirect = async() => {
      const cityName = parsedQuery.city
      const city = CITIES.find((c) => c.label === cityName)
      if (!city) {
        setErrMsg(`Şehir ismi yanlış: '${cityName}' bulunamadı.`)
        handleInitFromLocalStorage()
        return
      }

      setSelectedCity(city) 
      localStorage.setItem("selectedCity", JSON.stringify(city));

      // If the query only includes the city but not the siteId
      if (!parsedQuery.siteId) {
        handleInitFromSelectedCity(city)
        event.target.setView([city.latitude, city.longitude], 12)
        return
      }

      let newSites;
      // If the city is not changed, do not fetch again, use the existing sites
      if (cityName === selectedCity?.label && sites && sites.length !== 0 && sites[0] && sites[0].location.city === cityName) {
        newSites = [...sites]
      }
      // A new city 
      else {
        newSites = await fetchSitesOfSelectedCity(city)
        setSites(newSites)
      }


      const site = newSites.find((s) => s.id === Number(parsedQuery.siteId))
      if (!site) {
        setErrMsg("Yardim alani bulunamadı")
        handleInitFromSelectedCity(city)
        return
      }
      // If zooming in is disabled, the site cannot find the reference to the marker due to clustering
      // Therefore, we directly zoom in to the location of the sit
      event.target.setView([site.location.latitude, site.location.longitude], 15)
      // Markers are not loaded yet, we might need to wait a bit. I couldn't find a better solution yet.
      // If there is an event that fires when a marker is rendered, than we can use it.
      handleInitFromSelectedCityAndSiteId(city, site.id)
      setTimeout(() => {
        site?.markerRef?.openPopup()
      }, 500)
    }

    if (skipOnboarding) {
      handleQueryRedirect()
    }
    else {
      event.target.setView([INITIAL_SELECTED_CITY.latitude, INITIAL_SELECTED_CITY.longitude], 12)
    }
  };

  const handleShowMeClosestSite = (lat, long) => {
    if (!sites || sites.length === 0) {
      setErrMsg("En yakın yardım toplama noktası bulunamadı");
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
    setErrMsg(
      "En yakın yardım alanını bulabilmek için uygulamaya konum erişim izni vermeniz gerekiyor."
    );
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setErrMsg(null)
  }
  
  return (
    <div>
      <div
        className={minimizeHeader ? "button-group-minimize" : "button-group"}
      >
        <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top"          
        }}
          open={errMsg !== null}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
          sx={{
            width: 400,
          }}
        >
          <Alert
            severity="error"
            onClose={handleSnackbarClose}
            sx={{
              width: "100%",
              fontSize: 18
            }}
          >
            {errMsg}
          </Alert>
        </Snackbar>
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
      />
      <OnboardingDialog
        open={onboardingDialogOpen}
        handleClose={handleOnboardingDialogClose}
        handleShowMeClosestSite={handleShowMeClosestSite}
        showClosestSiteButton={true}
        handleSelectCity={handleSetSelectedCity}
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
