import React from 'react'
import {MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent} from "react-leaflet";
import {Button, Comment, Form, Header} from 'semantic-ui-react'

import {ChangeView} from "./CenterView";

const MAX_TOOLTIP_SIZE = 20;

const Map = ({handleCreateSiteDialogOpen, sites, center, addCommentToSite}) => {

  function MyComponent() {
    const map = useMapEvent('contextmenu', (e) => {
      const {lat, lng} = e.latlng;
      console.log(lat, lng)
      handleCreateSiteDialogOpen(lat, lng);
    })
    return null
  }

  return (
    <MapContainer center={center} zoom={12} maxZoom={15} scrollWheelZoom={true}>
      <ChangeView center={center}/>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        sites.filter(site => site.location && site.location.latitude && site.location.longitude)
          .map(site => {
            return (
              <Marker position={[site.location.latitude, site.location.longitude]}>
                <Tooltip permanent>
                  <span>{site.name.slice(0, MAX_TOOLTIP_SIZE).concat(site.name.length > MAX_TOOLTIP_SIZE ? "..." : "")}</span>
                </Tooltip>
                <Popup>
                  <div>
                    <p>Mekan: {site.name}</p>
                    <p>Şehir: {site.location.city}</p>
                    <p>Adres: {site.location.additionalAddress}</p>
                    <p>Organizasyon: {site.organizer}</p>
                    <p>İletişim: {site.contactInformation == "" ? "Bilinmiyor" : site.contactInformation}</p>

                    <Comment.Group>
                      <Header as='h5' dividing>
                        Güncellemeler
                      </Header>
                      {site.updates && site.updates.map(update => {
                        return (
                          <Comment>
                            <Comment.Content>
                              <Comment.Metadata>
                                <div>{update.createDateTime}</div>
                              </Comment.Metadata>
                              <Comment.Text>{update.update}</Comment.Text>
                            </Comment.Content>
                          </Comment>);
                      })
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