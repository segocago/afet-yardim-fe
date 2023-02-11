import React, { useEffect, useState } from "react";
import "./MainPage.css";
import Map from "../Map";
import { Autocomplete, TextField, Button, Tooltip } from "@mui/material";
import SiteService from "../../services/SiteService";
import { CITIES } from "../../constants/constants";
import CreateSiteDialog from "../CreateSiteDialog";
import OnboardingDialog from "../OnboardingDialog/OnboardingDialog";
import { getDistance } from "geolib";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  doesSiteNeedAnyHelp,
  FOOD,
  getStatusLevelForType,
  HUMAN_HELP,
  MATERIAL,
  NO_NEED_REQUIRED,
  PACKAGE_STATUS,
  UNKNOWN
} from "../utils/SiteUtils";

const SCREEN_WIDTH = window.screen.width;

// Move map to a bit north of closest site so that the popup dialog for marker shows correctly
const LONGITUDE_OFFSET =1.0;

const MainPage = () => {
  const [selectedCity, setSelectedCity] = useState(
    CITIES.find((city) => city.label === "Ankara")
  );
  const [sites, setSites] = useState([]);
  const [centerLocation, setCenterLocation] = useState([39.909442, 32.810491]);
  const [createSiteDialogOpen, setCreateSiteDialogOpen] = useState(false);
  const [onboardingDialogOpen, setOnboardingDialogOpen] = useState(true);
  const [lastClickedLatitude, setLastClickedLatitude] = useState(null);
  const [lastClickedLongitude, setLastClickedLongitude] = useState(null);
  const [minimizeHeader, setMinimizeHeader] = useState(false);
  const [mapRef, setMapRef] = useState(null);

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
    SiteService.getSites(selectedCity.label).then((res) => {
      setSites(res.data);
    });
  }, []);

  const handleCreateSiteDialogOpen = (lat, long) => {
    setCreateSiteDialogOpen(true);
    setLastClickedLatitude(lat);
    setLastClickedLongitude(long);
  };

  const handleCreateSiteDialogClose = (formValues) => {
    console.log(formValues);
    setCreateSiteDialogOpen(false);
  };

  const handleOnboardingDialogClose = () => {
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
    console.log(helpRequiredSites);

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

    mapRef.setView(
      [closestSite.location.latitude, closestSite.location.longitude + LONGITUDE_OFFSET],
      16
    );
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
      />
      <CreateSiteDialog
        open={createSiteDialogOpen}
        handleClose={handleCreateSiteDialogClose}
        latitude={lastClickedLatitude}
        longitude={lastClickedLongitude}
        onNewSiteCreated={onNewSiteCreated}
      />
    </div>
  );
};

export default MainPage;
