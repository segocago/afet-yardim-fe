import React, {Component} from 'react'
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

class Map extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <MapContainer center={[39.909442, 32.810491]} zoom={25} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[39.909442, 32.810491]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        )
    }
}

export default Map