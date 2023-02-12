import React, { useEffect, useState } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import {MapContainer, TileLayer, Marker, Tooltip} from "react-leaflet";
import SiteMarker from "./SiteMarker";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: require("./img/marker.png"),
  iconSize: [40, 40],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
});

const Map = ({sites, userLocation, center, addCommentToSite, whenMapReady}) => {

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
      {userLocation.loaded && !userLocation.error && (
                <Marker
                  icon={markerIcon}
                  position={[
                    userLocation.coordinates.lat,
                    userLocation.coordinates.lng,
                  ]}
                >
                  <Tooltip permanent>
                    <span>
                      <strong>Şuan Buradasınız</strong>
                    </span>
                  </Tooltip>
                </Marker>
              )}
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