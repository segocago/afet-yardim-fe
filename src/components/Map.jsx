import React, {useEffect, useState} from 'react'
import {MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvent} from "react-leaflet";
import {Button, Comment, Form, Header, TextArea} from 'semantic-ui-react'
import FilterBox from "./FilterBox";
import SiteMarker from "./SiteMarker";


const MAX_TOOLTIP_SIZE = 10;

//Times are kept in UTC timezone in DB so add 3 hours to it
const TIME_DIFFERENCE_IN_MILLIS = 3 * 60 * 60 * 1000;

const Map = ({handleCreateSiteDialogOpen, sites, center, addCommentToSite,whenMapReady}) => {

  const [mapRef, setMapRef] = useState(null);

  // Filters
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const handleVerificationChange = (value) => setShowOnlyVerified(value);

  useEffect(() => {
    if(center !== undefined && mapRef !== null){
      mapRef.setView(center)
    }
  }, [center])

  function MyComponent() {
    const map = useMapEvent('contextmenu', (e) => {
      const {lat, lng} = e.latlng;
      handleCreateSiteDialogOpen(lat, lng);
    })
    return null
  }

  return (
    <MapContainer ref={setMapRef} center={center} zoom={12} maxZoom={15} scrollWheelZoom={true}>
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
      <MyComponent></MyComponent>
    </MapContainer>
  );
}

export default Map