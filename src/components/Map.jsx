import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvent } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Button, Comment, Form, Header, TextArea } from 'semantic-ui-react';
import FilterBox from "./FilterBox";
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
      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={true}
        maxClusterRadius={100}
        spiderfyOnMaxZoom={true}
        disableClusteringAtZoom={12}
        removeOutsideVisibleBounds
      >
        {
          sites.filter(
            (site) => {
              let valid_sites = site.location && site.location.latitude && site.location.longitude
              
              // Apply filters
              if (showOnlyVerified) {
                valid_sites = valid_sites && site.verified
              }
              return valid_sites
            })
            .map(site => {
              return (
                <SiteMarker site={site} addCommentToSite={addCommentToSite}></SiteMarker>
              )
            })
        }
      </MarkerClusterGroup>
      <MyComponent></MyComponent>
    </MapContainer>
  );
}

export default Map