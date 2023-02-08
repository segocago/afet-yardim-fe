import React, {Component} from 'react'
import Map from "./Map";
import {MenuItem, Select} from "@mui/material";
import SiteService from "../services/SiteService";
import {CITIES} from "../constants/constants";

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCity: "Ankara",
            sites: []
        }
    }

    handleSelectCity = prop => {
        this.setState({selectedCity: prop.target.value});
        SiteService.getSites(prop.target.value).then((res) => {
            this.setState({sites: res.data});
        });
    }

    componentDidMount() {
        SiteService.getSites(this.state.selectedCity).then((res) => {
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
                            CITIES.map(city => <MenuItem value={city.text}>{city.text}</MenuItem>)
                        }
                    </Select>
                </div>
                <div style={{width: "100vw", height: "100vh"}}>
                    <Map sites={this.state.sites}></Map>
                </div>
                <br></br>
            </div>
        )
    }
}

export default MainPage
