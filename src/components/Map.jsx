import React, {useEffect, useState} from 'react'
import {MapContainer, TileLayer} from "react-leaflet";
import SiteMarker from "./SiteMarker";

const Map = ({sites, center, addCommentToSite, whenMapReady}) => {

  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    if (center && !center.some(value => value === null || value === undefined) && mapRef) {
      mapRef.setView(center)
    }
  }, [center])

  return (
    <MapContainer ref={setMapRef} center={center} zoom={12} maxZoom={15} minZoom={9} scrollWheelZoom whenReady={whenMapReady}>
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
    </MapContainer>
  );
}

export default Map