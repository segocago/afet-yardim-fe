import L from "leaflet";
import React, { useState } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { Button, Comment, Form, Header, TextArea } from "semantic-ui-react";
import {
  ACTIVE_STATUS,
  FOOD,
  HUMAN_HELP,
  MATERIAL, NEED_REQUIRED, NO_NEED_REQUIRED,
  PACKAGE_STATUS,
  UNKNOWN_LEVEL,
  URGENT_NEED_REQUIRED,
  getStatusLevelForType,
} from "./utils/SiteUtils";

const MAX_TOOLTIP_SIZE = 10;

//Times are kept in UTC timezone in DB so add 3 hours to it
const TIME_DIFFERENCE_IN_MILLIS = 3 * 60 * 60 * 1000;

const HOUSE_ICON = new L.icon({
  iconSize: [35],
  iconUrl: require("./img/house.png"),
});

const HUMAN_ICON = new L.icon({
  iconSize: [35],
  iconUrl: require("./img/human.jpg"),
});
const MATERIAL_ICON = new L.icon({
  iconSize: [35],
  iconUrl: require("./img/material.png"),
});
const FOOD_ICON = new L.icon({
  iconSize: [35],
  iconUrl: require("./img/food.png"),
});
const PACKAGE_ICON = new L.icon({
  iconSize: [35],
  iconUrl: require("./img/package.png"),
});

const NO_NEED_OR_CLOSED_ICON = new L.icon({
  iconSize: [35],
  iconUrl: require("./img/no_need_or_closed_icon.png"),
});

const UNKNOWN_ICON = new L.icon({
  iconSize: [35],
  iconUrl: require("./img/unknown.png"),
});

const SiteMarker = ({ site }) => {
  const [humanHelp, setHumanHelp] = useState(
    getStatusLevelForType(site, HUMAN_HELP)
  );
  const [material, setMaterial] = useState(
    getStatusLevelForType(site, MATERIAL)
  );
  const [food, setFood] = useState(getStatusLevelForType(site, FOOD));
  const [packageStatus, setPackageStatus] = useState(
    getStatusLevelForType(site, PACKAGE_STATUS)
  );

  const formatDate = (dateString) => {
    const date = new Date(
      new Date(dateString).getTime() + TIME_DIFFERENCE_IN_MILLIS
    );
    return date.toLocaleString();
  };

  const generateGoogleMapsLinkForSite = (site) => {
    return (
      "https://www.google.com/maps/dir/?api=1&destination=" +
      site.location.latitude +
      "," +
      site.location.longitude
    );
  };

  const getPinForSite = (site) => {
    if (site.type === "SHELTER") {
      return HOUSE_ICON;
    }

    if(site.activeStatus ===  ACTIVE_STATUS.NOT_ACTIVE){
      return NO_NEED_OR_CLOSED_ICON;
    }
    if(site.activeStatus === ACTIVE_STATUS.UNKNOWN_ACTIVITY){
      return UNKNOWN_ICON;
    }

    const humanNeedLevel = getStatusLevelForType(site, HUMAN_HELP);
    const materialNeedLevel = getStatusLevelForType(site, MATERIAL);
    const foodNeedLevel = getStatusLevelForType(site, FOOD);
    const packageNeedLevel = getStatusLevelForType(site, PACKAGE_STATUS);

    //Urgent needs
    if (humanNeedLevel === URGENT_NEED_REQUIRED) {
      return HUMAN_ICON;
    }
    if (materialNeedLevel === URGENT_NEED_REQUIRED) {
      return MATERIAL_ICON;
    }
    if (foodNeedLevel === URGENT_NEED_REQUIRED) {
      return FOOD_ICON;
    }
    if (packageNeedLevel === URGENT_NEED_REQUIRED) {
      return PACKAGE_ICON;
    }

    //Need requireds
    if (humanNeedLevel === NEED_REQUIRED) {
      return HUMAN_ICON;
    }
    if (materialNeedLevel === NEED_REQUIRED) {
      return MATERIAL_ICON;
    }
    if (foodNeedLevel === NEED_REQUIRED) {
      return FOOD_ICON;
    }
    if (packageNeedLevel === NEED_REQUIRED) {
      return PACKAGE_ICON;
    }

    //No need requireds
    if (humanNeedLevel === NO_NEED_REQUIRED &&materialNeedLevel === NO_NEED_REQUIRED
        && foodNeedLevel === NO_NEED_REQUIRED && packageNeedLevel === NO_NEED_REQUIRED) {
      return NO_NEED_OR_CLOSED_ICON;
    }
    //Unknown
    return UNKNOWN_ICON;
  };

  const getNameLabel = (siteType) => {
    return siteType === "SHELTER"
      ? "Konaklama Noktası İsmi"
      : "Yardım Noktası İsmi";
  };

  const getOrganizerLabel = (siteType) => {
    return siteType === "SHELTER" ? "Ev Sahibi İsmi" : "Organize Eden Kurum";
  };

  const getTextForSiteStatusLevel = (siteStatusLevel) => {
    switch (siteStatusLevel){
      case UNKNOWN_LEVEL: return  <span style={{color:"gray"}}>Bilinmiyor </span>
      case NO_NEED_REQUIRED: return  <span style={{color:"red"}}>YOK </span>;
      case NEED_REQUIRED: return <span style={{color:"green"}}>VAR </span>;
      case URGENT_NEED_REQUIRED:  return <span style={{color:"green"}}>ACİL VAR </span>
      default: return  <span style="color:green">Bilinmiyor</span>;
    }
  };

  const getStatusLevelTextForType = (site, siteStatusType) => {
    const statusLevel = getStatusLevelForType(site, siteStatusType);
    return getTextForSiteStatusLevel(statusLevel);
  };

  const getSiteActiveText = (activeStatus)=> {

    if(activeStatus === ACTIVE_STATUS.ACTIVE){
      return <span style={{color:"green"}}>AÇIK </span>;
    }
    if(activeStatus === ACTIVE_STATUS.NOT_ACTIVE){
      <span style={{color:"red"}}>KAPALI </span>
    }

    return <span style={{color:"gray"}}>BİLİNMİYOR </span>
  }

  const getSiteNameText = (site)=> {

    let nameColor = "gray";
    if(site.activeStatus === ACTIVE_STATUS.ACTIVE){
      nameColor = "green";
    }else if (site.activeStatus === ACTIVE_STATUS.NOT_ACTIVE){
      nameColor = "red";
    }
    return <span style={{color: nameColor}}>{site.name} </span>
  }

  const constructSiteStatuses = () => {
    const siteStatuses = [];

    siteStatuses.push( {
      siteStatusType : HUMAN_HELP,
      siteStatusLevel: humanHelp ? humanHelp : UNKNOWN_LEVEL
    })
    siteStatuses.push( {
      siteStatusType : MATERIAL,
      siteStatusLevel: material ? material : UNKNOWN_LEVEL
    })
    siteStatuses.push( {
      siteStatusType : FOOD,
      siteStatusLevel: food ? food : UNKNOWN_LEVEL
    })
    siteStatuses.push( {
      siteStatusType : PACKAGE_STATUS,
      siteStatusLevel: packageStatus ? packageStatus : UNKNOWN_LEVEL
    })
    return siteStatuses;
  };

  return (
    <Marker
      position={[site.location.latitude, site.location.longitude]}
      ref={(ref) => (site.markerRef = ref)}
      icon={getPinForSite(site)}
      eventHandlers={{
        popupopen: (e) => {
          window.history.pushState(null, "", `/?city=${site.location.city}&siteId=${site.id}`)
        },
      }}
    >
      <Tooltip permanent>
        <span>
          {site.name
            .slice(0, MAX_TOOLTIP_SIZE)
            .trim()
            .concat(site.name.length > MAX_TOOLTIP_SIZE ? "..." : "")}
        </span>
      </Tooltip>
      <Popup
        eventHandlers={{
          remove: (e) => {
            window.history.pushState(null, '', `?city=${site.location.city}`)
          }
        }}
      >
        <div className="popup-container-div">
          <div className="popup-text-form">
            <p>
              <b>{getNameLabel(site.type)}:</b> {getSiteNameText(site)}
            </p>
            <p>
              <b>Açık/Kapalı:</b> {getSiteActiveText(site.activeStatus)}
            </p>
            <p>
              <b>Şehir:</b> {site.location.city}
            </p>
            <p>
              <b>İlçe:</b> {site.location.district}
            </p>
            <p>
              <b>Adres:</b> {site.location.additionalAddress}
            </p>
            <p>
              <b>{getOrganizerLabel(site.type)}:</b> {site.organizer}
            </p>
            <p>
              <b>Açıklama:</b> {site.description}
            </p>
            <p>
              <b>İletişim Bilgileri:</b>
              {site.contactInformation == ""
                ? "Bilinmiyor"
                : site.contactInformation}
            </p>
            <div className="need-help-cont">
              <div className="need-help-item">
                <b>İnsan İhtiyacı:</b>
                {getStatusLevelTextForType(site, HUMAN_HELP)}
              </div>
              <div className="need-help-item">
                <b>Materyal İhtiyacı:</b>
                {getStatusLevelTextForType(site, MATERIAL)}
              </div>
              <div className="need-help-item">
                <b>Gıda İhtiyacı:</b> {getStatusLevelTextForType(site, FOOD)}
              </div>
              <div className="need-help-item">
                <b>Koli İhtiyacı:</b>
                {getStatusLevelTextForType(site, PACKAGE_STATUS)}
              </div>
            </div>
            <Button>
              <a href={generateGoogleMapsLinkForSite(site)} target="_blank" rel="noreferrer">
                Bu Alana Yol Tarifi Al
              </a>
            </Button>
          </div>

          <Comment.Group className={"site-comments"}>
            <Header as="h5" dividing>
              Güncellemeler
            </Header>
            {site.updates &&
              site.updates
                .sort((site1, site2) => {
                  return site1.createDateTime < site2.createDateTime ? 1 : -1;
                })
                .filter((update) => update.update && update.update !== "")
                .map((update) => {
                  return (
                    <Comment>
                      <Comment.Content>
                        <Comment.Metadata>
                          <div>{formatDate(update.createDateTime)}</div>
                        </Comment.Metadata>
                        <Comment.Text>{update.update}</Comment.Text>
                      </Comment.Content>
                    </Comment>
                  );
                })}
            {(site.updates === undefined ||
              site.updates === null ||
              site.updates.length === 0 ||
              site.updates.filter(
                (update) => update.update && update.update !== ""
              ).length === 0) && (
              <Comment>
                <Comment.Content>
                  <Comment.Text>Son güncelleme bulunmuyor.</Comment.Text>
                </Comment.Content>
              </Comment>
            )}
          </Comment.Group>
        </div>
      </Popup>
    </Marker>
  );
};

export default SiteMarker;
