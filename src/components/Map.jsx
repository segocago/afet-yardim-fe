import React from 'react'
import {MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent} from "react-leaflet";
import {Button, Comment, Form, Header} from 'semantic-ui-react'

import {ChangeView} from "./CenterView";

const MAX_TOOLTIP_SIZE = 15;

//Times are kept in UTC timezone in DB so add 3 hours to it
const TIME_DIFFERENCE_IN_MILLIS = 3 * 60 * 60 * 1000;

const Map = ({handleCreateSiteDialogOpen, sites, center, addCommentToSite,whenMapReady}) => {

  function MyComponent() {
    const map = useMapEvent('contextmenu', (e) => {
      const {lat, lng} = e.latlng;
      handleCreateSiteDialogOpen(lat, lng);
    })
    return null
  }

  const formatDate = (dateString) => {
    const date = new Date(new Date(dateString).getTime() + TIME_DIFFERENCE_IN_MILLIS);
    return date.toLocaleString();
  }
  // https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=<latitude>,<longitude>
  // https://www.google.es/maps/dir/'52.51758801683297,13.397978515625027'/'52.49083837044266,13.369826049804715'/data=!4m2!4m1!3e2
  const generateGoogleMapsLinkForSite = (site) => {
    return "https://www.google.com/maps/dir/?api=1&destination=" + site.location.latitude + "," + site.location.longitude;
  }



  return (
    <MapContainer center={center} zoom={12} maxZoom={15} scrollWheelZoom={true} whenReady={whenMapReady}>
      <ChangeView center={center}/>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        sites.filter(site => site.location && site.location.latitude && site.location.longitude)
          .map(site => {
            return (
              <Marker position={[site.location.latitude, site.location.longitude]} ref={(ref) => site.markerRef = ref } >
                  <Tooltip permanent>
                  <span>{site.name.slice(0, MAX_TOOLTIP_SIZE).trim().concat(site.name.length > MAX_TOOLTIP_SIZE ? "..." : "")}</span>
                </Tooltip>
                <Popup>
                  <div>
                    <p>Mekan: {site.name}</p>
                    <p>Şehir: {site.location.city}</p>
                    <p>Adres: {site.location.additionalAddress}</p>
                    <p>Organizasyon: {site.organizer}</p>
                      <p>Açıklama: {site.description}</p>
                    <p>İletişim: {site.contactInformation == "" ? "Bilinmiyor" : site.contactInformation}</p>
                    <p><Button><a href={generateGoogleMapsLinkForSite(site)} target="_blank"> Bu alana yol tarifi al</a></Button>
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

                    <form onSubmit={(event) => addCommentToSite(event, site.id)}>
                      <Form.TextArea/>
                      <Button content='Güncelleme Ekle' labelPosition='left' icon='edit'
                              primary/>
                    </form>
                  </div>
                </Popup>
              </Marker>
            )
          })
      }
      <MyComponent></MyComponent>
    </MapContainer>
  )
}

export default Map