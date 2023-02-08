import React, {Component} from 'react'
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

class Map extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {sites} = this.props;
        return (
            <MapContainer center={[39.909442, 32.810491]} zoom={25} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    sites.filter(site => site.location && site.location.latitude && site.location.longitude)
                        .map(site => {
                            return (
                                <Marker position={[site.location.latitude, site.location.longitude]}>
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