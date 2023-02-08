import React, {Component} from 'react'
import {MapContainer, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import {ChangeView} from "./CenterView";

const MAX_TOOLTIP_SIZE = 20;

class Map extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {sites, center} = this.props;
        return (
            <MapContainer center={center} zoom={12} scrollWheelZoom={true}>
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
                                        {site.name}
                                    </Popup>
                                </Marker>
                            )
                        })
                }
            </MapContainer>
        )
    }
}

export default Map