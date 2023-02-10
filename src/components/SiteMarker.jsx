import React, {useState} from 'react'
import { Marker, Popup,  Tooltip} from "react-leaflet";
import {Button, Comment, Form, Header, TextArea} from 'semantic-ui-react'
import L from "leaflet";


const MAX_TOOLTIP_SIZE = 10;

//Times are kept in UTC timezone in DB so add 3 hours to it
const TIME_DIFFERENCE_IN_MILLIS = 3 * 60 * 60 * 1000;

const HOUSE_ICON = new L.icon({iconSize: [35], iconUrl: require("./img/house.png")});

const HUMAN_ICON = new L.icon({iconSize: [35], iconUrl: require("./img/human.jpg")});
const MATERIAL_ICON = new L.icon({iconSize: [35], iconUrl: require("./img/material.png")});
const FOOD_ICON = new L.icon({iconSize: [35], iconUrl: require("./img/food.png")});
const PACKAGE_ICON = new L.icon({iconSize: [35], iconUrl: require("./img/package.png")});

const NO_NEED_ICON = new L.icon({iconSize: [35], iconUrl: require("./img/no_need_icon.png")});

const SiteMarker = ({site, addCommentToSite}) => {

  //Status levels
  const NO_NEED_REQUIRED = "NO_NEED_REQUIRED";
  const NEED_REQUIRED = "NEED_REQUIRED";
  const URGENT_NEED_REQUIRED = "URGENT_NEED_REQUIRED";

  //status types
  const HUMAN_HELP = "HUMAN_HELP";
  const MATERIAL = "MATERIAL";
  const FOOD ="FOOD";
  const PACKAGE_STATUS ="PACKAGE";


  const getStatusLevelForType = (site,siteStatusType) => {

    if(!site.lastSiteStatuses){
      return NO_NEED_REQUIRED;
    }

    const siteStatus = site.lastSiteStatuses.find(siteStatus => siteStatus.siteStatusType === siteStatusType);

    if(!siteStatus){
      return NO_NEED_REQUIRED;
    }
    return siteStatus.siteStatusLevel;

  }

  const [humanHelp,setHumanHelp] = useState(getStatusLevelForType(site,HUMAN_HELP))
  const [material,setMaterial] = useState(getStatusLevelForType(site,MATERIAL))
  const [food,setFood] = useState(getStatusLevelForType(site,FOOD))
  const [packageStatus,setPackageStatus] = useState(getStatusLevelForType(site,PACKAGE_STATUS))

  const formatDate = (dateString) => {
    const date = new Date(new Date(dateString).getTime() + TIME_DIFFERENCE_IN_MILLIS);
    return date.toLocaleString();
  }


  const generateGoogleMapsLinkForSite = (site) => {
    return "https://www.google.com/maps/dir/?api=1&destination=" + site.location.latitude + "," + site.location.longitude;
  }

  const getPinForSite = (site) => {

    if(site.type === "SHELTER" ){
      return HOUSE_ICON;
    }

    const humanNeedLevel = getStatusLevelForType(site,HUMAN_HELP);
    const materialNeedLevel = getStatusLevelForType(site,MATERIAL);
    const foodNeedLevel = getStatusLevelForType(site,FOOD);
    const packageNeedLevel = getStatusLevelForType(site,PACKAGE_STATUS);

    //Urgent needs
    if(humanNeedLevel === URGENT_NEED_REQUIRED){
      return HUMAN_ICON;
    }
    if(materialNeedLevel === URGENT_NEED_REQUIRED){
      return MATERIAL_ICON;
    }
    if(foodNeedLevel === URGENT_NEED_REQUIRED){
      return FOOD_ICON;
    }
    if(packageNeedLevel === URGENT_NEED_REQUIRED){
      return PACKAGE_ICON;
    }

    //Need requireds
    if(humanNeedLevel === NEED_REQUIRED){
      return HUMAN_ICON;
    }
    if(materialNeedLevel === NEED_REQUIRED){
      return MATERIAL_ICON;
    }
    if(foodNeedLevel === NEED_REQUIRED){
      return FOOD_ICON;
    }
    if(packageNeedLevel === NEED_REQUIRED){
      return PACKAGE_ICON;
    }

    return NO_NEED_ICON;
  }


  const getNameLabel = (siteType) => {
    return siteType === "SHELTER" ? "Konaklama Noktası İsmi" : "Yardım Noktası İsmi";
  }

  const getOrganizerLabel = (siteType) => {
    return siteType === "SHELTER" ? "Ev Sahibi İsmi" : "Organize Eden Kurum";
  }

  const getTextForSiteStatusLevel = (siteStatusLevel) => {
    switch (siteStatusLevel){
      case NO_NEED_REQUIRED: return  <span style={{color:"green"}}>Yok </span>;
      case NEED_REQUIRED: return <span style={{color:"blue"}}>Var </span>;
      case URGENT_NEED_REQUIRED:  return <span style={{color:"red"}}>Acil var </span>
      default: return  <span style="color:green">Yok</span>;
    }
  }

  const getStatusLevelTextForType = (site,siteStatusType) => {
    const statusLevel = getStatusLevelForType(site,siteStatusType);
    return getTextForSiteStatusLevel(statusLevel);
  }


  const constructSiteStatuses = () => {

    const siteStatuses = [];
    siteStatuses.push( {
      siteStatusType : HUMAN_HELP,
      siteStatusLevel: humanHelp ? humanHelp : NO_NEED_REQUIRED
    })
    siteStatuses.push( {
      siteStatusType : MATERIAL,
      siteStatusLevel: material ? material : NO_NEED_REQUIRED
    })
    siteStatuses.push( {
      siteStatusType : FOOD,
      siteStatusLevel: food ? food : NO_NEED_REQUIRED
    })
    siteStatuses.push( {
      siteStatusType : PACKAGE_STATUS,
      siteStatusLevel: packageStatus? packageStatus : NO_NEED_REQUIRED
    })
    return siteStatuses;
  }

  return (
      <Marker position={[site.location.latitude, site.location.longitude]} ref={(ref) => site.markerRef = ref } icon={getPinForSite(site)}>
        <Tooltip permanent>
          <span>{site.name.slice(0, MAX_TOOLTIP_SIZE).trim().concat(site.name.length > MAX_TOOLTIP_SIZE ? "..." : "")}</span>
        </Tooltip>
        <Popup>
          <div className="popup-container-div">
            <p><b>{getNameLabel(site.type)}:</b> {site.name}</p>
            <p><b>Şehir:</b> {site.location.city}</p>
            <p><b>İlçe:</b> {site.location.district}</p>
            <p><b>Adres:</b> {site.location.additionalAddress}</p>
            <p><b>{getOrganizerLabel(site.type)}:</b> {site.organizer}</p>
            <p><b>Açıklama:</b> {site.description}</p>
            <p><b>İletişim Bilgileri:</b> {site.contactInformation == "" ? "Bilinmiyor" : site.contactInformation}</p>
            <p><b>İnsan İhtiyacı:</b> {getStatusLevelTextForType(site,HUMAN_HELP)} <b>Materyal İhtiyacı:</b> {getStatusLevelTextForType(site,MATERIAL)}
              <b>Gıda İhtiyacı:</b> {getStatusLevelTextForType(site,FOOD)} <b>Koli İhtiyacı:</b> {getStatusLevelTextForType(site,PACKAGE_STATUS)}
            </p>
            <p><Button><a href={generateGoogleMapsLinkForSite(site)} target="_blank"> Bu Alana Yol Tarifi Al</a></Button>
            </p>

            <Comment.Group className={"site-comments"}>
              <Header as='h5' dividing>
                Güncellemeler
              </Header>
              {site.updates && site.updates.sort((site1, site2) => {
                return site1.createDateTime < site2.createDateTime ? 1 : -1;
              }).filter(update => update.update && update.update !== "")
                  .map(update => {
                    return (
                        <Comment>
                          <Comment.Content>
                            <Comment.Metadata>
                              <div>{formatDate(update.createDateTime)}</div>
                            </Comment.Metadata>
                            <Comment.Text>{update.update}</Comment.Text>
                          </Comment.Content>
                        </Comment>);
                  })
              }
              {
                  (site.updates === undefined || site.updates === null || site.updates.length === 0 ||
                      site.updates.filter(update => update.update && update.update !== "").length === 0) &&
                  <Comment>
                    <Comment.Content>
                      <Comment.Text>Son güncelleme bulunmuyor.</Comment.Text>
                    </Comment.Content>
                  </Comment>
              }
            </Comment.Group>

            <Form onSubmit={(event) => addCommentToSite(event, site.id, constructSiteStatuses())}>
              <TextArea placeholder="Alanla ilgili son bilgileri buraya girebilirsiniz" style={{minHeight: 100,width: "100%"}}/>
              <Form.Group inline>
                <label>İnsan İhtiyacı:</label>
                <Form.Radio
                    label='Yok'
                    value='NO_NEED_REQUIRED'
                    checked={humanHelp === 'NO_NEED_REQUIRED'}
                    onChange={(e,{value}) => setHumanHelp(value)}
                />
                <Form.Radio
                    label='Var'
                    value='NEED_REQUIRED'
                    checked={humanHelp === 'NEED_REQUIRED'}
                    onChange={(e,{value}) => setHumanHelp(value)}
                />
                <Form.Radio
                    label='Acil Var'
                    value='URGENT_NEED_REQUIRED'
                    checked={humanHelp === 'URGENT_NEED_REQUIRED'}
                    onChange={(e,{value}) => setHumanHelp(value)}
                />
              </Form.Group>
              <Form.Group inline>
                <label>Materyal İhtiyacı:</label>
                <Form.Radio
                    label='Yok'
                    value='NO_NEED_REQUIRED'
                    checked={material === 'NO_NEED_REQUIRED'}
                    onChange={(e,{value}) => setMaterial(value)}
                />
                <Form.Radio
                    label='Var'
                    value='NEED_REQUIRED'
                    checked={material === 'NEED_REQUIRED'}
                    onChange={(e,{value}) => setMaterial(value)}
                />
                <Form.Radio
                    label='Acil Var'
                    value='URGENT_NEED_REQUIRED'
                    checked={material === 'URGENT_NEED_REQUIRED'}
                    onChange={(e,{value}) => setMaterial(value)}
                />
              </Form.Group>
              <Form.Group inline>
                <label>Gıda İhtiyacı:</label>
                <Form.Radio
                    label='Yok'
                    value='NO_NEED_REQUIRED'
                    checked={food === 'NO_NEED_REQUIRED'}
                    onChange={(e,{value}) => setFood(value)}
                />
                <Form.Radio
                    label='Var'
                    value='NEED_REQUIRED'
                    checked={food === 'NEED_REQUIRED'}
                    onChange={(e,{value}) => setFood(value)}
                />
                <Form.Radio
                    label='Acil Var'
                    value='URGENT_NEED_REQUIRED'
                    checked={food === 'URGENT_NEED_REQUIRED'}
                    onChange={(e,{value}) => setFood(value)}
                />
              </Form.Group>
              <Form.Group inline>
                <label>Koli İhtiyacı:</label>
                <Form.Radio
                    label='Yok'
                    value='NO_NEED_REQUIRED'
                    checked={packageStatus === 'NO_NEED_REQUIRED'}
                    onChange={(e,{value}) => setPackageStatus(value)}
                />
                <Form.Radio
                    label='Var'
                    value='NEED_REQUIRED'
                    checked={packageStatus === 'NEED_REQUIRED'}
                    onChange={(e,{value}) => setPackageStatus(value)}
                />
                <Form.Radio
                    label='Acil Var'
                    value='URGENT_NEED_REQUIRED'
                    checked={packageStatus === 'URGENT_NEED_REQUIRED'}
                    onChange={(e,{value}) => setPackageStatus(value)}
                />
              </Form.Group>
              <Button content='Güncelleme Ekle' labelPosition='left' icon='edit' primary/>
            </Form>
          </div>
        </Popup>
      </Marker>
  )
}

export default SiteMarker