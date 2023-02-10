import React, { Component, useEffect, useState } from "react";
import "./MainPage.css";
import Map from "../Map";
import { Autocomplete, TextField, Button, Tooltip } from "@mui/material";
import SiteService from "../../services/SiteService";
import { CITIES } from "../../constants/constants";
import CreateSiteDialog from "../CreateSiteDialog";
import OnboardingDialog from "../OnboardingDialog/OnboardingDialog";
import {getDistance} from "geolib";

const MainPage = () => {
    const [selectedCity, setSelectedCity] = useState(CITIES.find((city) => city.label === "Ankara"));
    const [sites, setSites] = useState([]);
    const [centerLocation, setCenterLocation] = useState([39.909442, 32.810491]);
    const [createSiteDialogOpen, setCreateSiteDialogOpen] = useState(false);
    const [onboardingDialogOpen, setOnboardingDialogOpen] = useState(true);
    const [lastClickedLatitude, setLastClickedLatitude] = useState(null);
    const [lastClickedLongitude, setLastClickedLongitude] = useState(null);
    const [mapRef, setMapRef] = useState(null);
  
  const handleSelectCity = (newValue) => {
    const lat = parseFloat(newValue.latitude);
    const lon = parseFloat(newValue.longitude);
    setSelectedCity(newValue);
    const center = [lat, lon]

    if (center !== undefined) {
      setCenterLocation(center);
    }
  }
  
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

    if(event.target[0].value === undefined || event.target[0].value === null || event.target[0].value.trim().length === 0){
      alert("Boş yorum eklenemenez.")
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
  }

  const handleShowMeClosestSite = (lat,long) => {

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
    setOnboardingDialogOpen(false);
  }
  
  const onGetUserLocation = (position) => {
    this.props.handleShowMeClosestSite(
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
      <div className="button-group">
        <Autocomplete
          style={{ marginTop: 15, width: "30%" }}
          disablePortal
          options={CITIES}
          renderInput={(params) => <TextField {...params} label="Şehir" />}
          onChange={handleSelectCity}
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
        >
          BANA EN YAKIN YARDIM NOKTASINI GÖSTER
        </Button>
        <Tooltip title="Haritaya sağ tıklayarak veya mobil cihazlarda ekrana basılı tutarak yeni yardım noktası ekleyebilirsiniz">
          <Button variant="contained">YENİ YARDIM NOKTASI EKLE</Button>
        </Tooltip>
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
}

export default MainPage;
