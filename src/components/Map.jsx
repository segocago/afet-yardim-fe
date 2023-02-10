import React from 'react'
import {MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent} from "react-leaflet";
import {Button, Comment, Form, Header, TextArea} from 'semantic-ui-react'
import L from "leaflet";

import {ChangeView} from "./CenterView";
import SiteMarker from "./SiteMarker";

const MAX_TOOLTIP_SIZE = 10;

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
              <SiteMarker site={site} addCommentToSite={addCommentToSite}></SiteMarker>
            )
          })
      }
      <MyComponent></MyComponent>
    </MapContainer>
  )
}

export default Map