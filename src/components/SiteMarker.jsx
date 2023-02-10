import React, {useState} from 'react'
import { Marker, Popup,  Tooltip} from "react-leaflet";
import {Button, Comment, Form, Header, TextArea} from 'semantic-ui-react'
import L from "leaflet";


const MAX_TOOLTIP_SIZE = 10;

//Times are kept in UTC timezone in DB so add 3 hours to it
const TIME_DIFFERENCE_IN_MILLIS = 3 * 60 * 60 * 1000;

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
  // https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=<latitude>,<longitude>
  // https://www.google.es/maps/dir/'52.51758801683297,13.397978515625027'/'52.49083837044266,13.369826049804715'/data=!4m2!4m1!3e2
  const generateGoogleMapsLinkForSite = (site) => {
    return "https://www.google.com/maps/dir/?api=1&destination=" + site.location.latitude + "," + site.location.longitude;
  }

  // {
  //   "id": 221,
  //     "createDateTime": "2023-02-10T08:15:51.232218",
  //     "name": "Yazılım Test Alanı - Görmezden Gelin",
  //     "location": {
  //   "city": "Ankara",
  //       "district": "Yazılım Test Alanı - Görmezden Gelin",
  //       "additionalAddress": "Yazılım Test Alanı - Görmezden Gelin",
  //       "longitude": 31.629638671875004,
  //       "latitude": 41.274839240974394
  // },
  //   "organizer": "Yazılım Test Alanı - Görmezden Gelin",
  //     "description": "Yazılım Test Alanı - Görmezden Gelin",
  //     "contactInformation": "Yazılım Test Alanı - Görmezden Gelin",
  //     "updates": [
  //   {
  //     "createDateTime": "2023-02-10T08:54:52.116882634",
  //     "update": "test1",
  //     "siteStatuses": null
  //   },
  //   {
  //     "createDateTime": "2023-02-10T08:54:58.077368435",
  //     "update": "test2",
  //     "siteStatuses": null
  //   },
  //   {
  //     "createDateTime": "2023-02-10T09:01:44.387126164",
  //     "update": "2- Test update 3",
  //     "siteStatuses": [
  //       {
  //         "siteStatusType": "HUMAN_HELP",
  //         "siteStatusLevel": "URGENT_NEED_REQUIRED"
  //       },
  //       {
  //         "siteStatusType": "MATERIAL",
  //         "siteStatusLevel": "NEED_REQUIRED"
  //       },
  //       {
  //         "siteStatusType": "FOOD",
  //         "siteStatusLevel": "NEED_REQUIRED"
  //       },
  //       {
  //         "siteStatusType": "PACKAGE",
  //         "siteStatusLevel": "NO_NEED_REQUIRED"
  //       }
  //     ]
  //   }
  // ],
  //     "lastSiteStatuses": [
  //   {
  //     "siteStatusType": "HUMAN_HELP",
  //     "siteStatusLevel": "URGENT_NEED_REQUIRED"
  //   },
  //   {
  //     "siteStatusType": "MATERIAL",
  //     "siteStatusLevel": "NEED_REQUIRED"
  //   },
  //   {
  //     "siteStatusType": "FOOD",
  //     "siteStatusLevel": "NEED_REQUIRED"
  //   },
  //   {
  //     "siteStatusType": "PACKAGE",
  //     "siteStatusLevel": "NO_NEED_REQUIRED"
  //   }
  // ],
  //     "type": "SUPPLY",
  //     "verified": false
  // }




  const getPinForSite = (siteType) => {

    if(siteType === "SHELTER" ){
      return new L.icon({iconSize: [35], iconUrl: require("./img/house.png")});
    }

    return new L.icon({iconSize: [35], iconUrl: require("./img/box.png")});
  }

  const getNameLabel = (siteType) => {
    return siteType === "SHELTER" ? "Konaklama Noktası İsmi" : "Yardım Noktası İsmi";
  }

  const getOrganizerLabel = (siteType) => {
    return siteType === "SHELTER" ? "Ev Sahibi İsmi" : "Organize Eden Kurum";
  }

  return (
      <Marker position={[site.location.latitude, site.location.longitude]} ref={(ref) => site.markerRef = ref } icon={getPinForSite(site.type)}>
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

            <Form onSubmit={(event) => addCommentToSite(event, site.id)}>
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