import React, { Component, useEffect, useState } from "react";
import Map from "./Map";
import { Autocomplete, TextField } from "@mui/material";
import SiteService from "../services/SiteService";
import { CITIES } from "../constants/constants";
import CreateSiteDialog from "./CreateSiteDialog";
import OnboardingDialog from "./OnboardingDialog/OnboardingDialog";
import { useMap } from "react-leaflet";

const MainPage = () => {

    const [selectedCity, setSelectedCity] = useState(CITIES.find((city) => city.label === "Ankara"));
    const [sites, setSites] = useState([]);
    const [centerLocation, setCenterLocation] = useState([39.909442, 32.810491]);
    const [createSiteDialogOpen, setCreateSiteDialogOpen] = useState(false);
    const [onboardingDialogOpen, setOnboardingDialogOpen] = useState(true);
    const [lastClickedLatitude, setLastClickedLatitude] = useState(null);
    const [lastClickedLongitude, setLastClickedLongitude] = useState(null);
  
  const handleSelectCity = (newValue) => {
    const lat = parseFloat(newValue.latitude);
    const lon = parseFloat(newValue.longitude);
    setSelectedCity(newValue);
    const center = [lat, lon]

    if(center !== undefined){
      setCenterLocation(center);
    }
  };

  useEffect(() => {

    SiteService.getSites(selectedCity.label).then((res) => {
      setSites(res.data);
    });
  },[])


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

  const addCommentToSite = (event, siteId) => {
    event.preventDefault();
    let comment = {};
    comment.update = event.target[0].value;
    
    SiteService.addCommentToSite(siteId, comment).then((res) => {
      let updatedSites = sites.map(site => {
        if (site.id == siteId) {
          return res.data;
        }
        return site;
      });
      setSites(updatedSites);
    });
  };

  return (
    <div>
      <Autocomplete
        style={{ marginTop: 15 }}
        disablePortal
        options={CITIES}
        renderInput={(params) => <TextField {...params} label="Şehir" />}
        onChange={(event, value) => {
          console.log(value)
          handleSelectCity(value);
        }}
        value={selectedCity}
      />
      <Map
        sites={sites}
        center={centerLocation}
        addCommentToSite={addCommentToSite}
        handleCreateSiteDialogOpen={handleCreateSiteDialogOpen}
      ></Map>
      <OnboardingDialog
        open={onboardingDialogOpen}
        handleClose={handleOnboardingDialogClose}
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
