import React, {useEffect, useState} from 'react'
import {MapContainer, TileLayer} from "react-leaflet";
import FilterBox from "./FilterBox";
import SiteMarker from "./SiteMarker";

const Map = ({sites, center, addCommentToSite, whenMapReady}) => {

  const [mapRef, setMapRef] = useState(null);

  // Filters
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const handleVerificationChange = (value) => setShowOnlyVerified(value);

  useEffect(() => {
    if (center && !center.some(value => value === null || value === undefined) && mapRef) {
      mapRef.setView(center)
    }
  }, [center])

  return (
    <MapContainer ref={setMapRef} center={center} zoom={12} maxZoom={16} minZoom={11} scrollWheelZoom whenReady={whenMapReady}>
    <FilterBox
      showOnlyVerified={showOnlyVerified}
      handleVerificationChange={handleVerificationChange}
    />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
    </MapContainer>
  );
}

export default Map