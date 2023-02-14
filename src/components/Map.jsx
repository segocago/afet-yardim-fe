import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import SiteMarker from "./SiteMarker";

const Map = ({sites, center, addCommentToSite, whenMapReady}) => {
  const [mapRef, setMapRef] = useState(null);
  console.log(sites)
  
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
      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={true}
        maxClusterRadius={80}
        spiderfyOnMaxZoom={true}
        disableClusteringAtZoom={14}
        removeOutsideVisibleBounds
      >
        {
          sites.filter(site => site.location && site.location.latitude && site.location.longitude)
            .map(site => {
              return (
                <SiteMarker site={site} addCommentToSite={addCommentToSite}></SiteMarker>
              )
            })
        }
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default Map