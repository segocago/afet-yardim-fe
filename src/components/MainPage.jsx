import React, {Component} from 'react'
import Map from "./Map";
import {MenuItem, Select} from "@mui/material";
import SiteService from "../services/SiteService";
import {CITIES} from "../constants/constants";

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCity: CITIES.find(city => city.text === "Ankara"),
            sites: [],
            centerLocation: [39.909442, 32.810491]
        }
    }

    handleSelectCity = prop => {
        const lat = parseFloat(prop.target.value.latitude);
        const lon = parseFloat(prop.target.value.longitude);
        this.setState({selectedCity: prop.target.value, centerLocation: [lat, lon]});
        SiteService.getSites(prop.target.value).then((res) => {
            this.setState({sites: res.data});
        });
    }

    componentDidMount() {
        SiteService.getSites(this.state.selectedCity.text).then((res) => {
            this.setState({sites: res.data});
        });
    }

    render() {
        return (
            <div>
                <div style={{zIndex: 9999}}>
                    <Select
                        labelId="city-select-label"
                        id="city-simple-select"
                        value={this.state.selectedCity}
                        label="Şehir"
                        onChange={this.handleSelectCity}
                    >
                        {
                            CITIES.map(city => <MenuItem value={city}>{city.text}</MenuItem>)
                        }
                    </Select>
                </div>
                <div style={{width: "100vw", height: "100vh"}}>
                    <Map sites={this.state.sites} center={this.state.centerLocation}></Map>
                </div>
                <br></br>
            </div>
        )
    }
}

export default MainPage
