import React, {Component} from 'react'
import Map from "./Map";
import {MenuItem, Select} from "@mui/material";
import SiteService from "../services/SiteService";

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
    }

    componentDidMount() {
        SiteService.getSiteById(this.state.selectedCity).then((res) => {
            this.setState({sites: res.data});
        });
    }

    render() {
        return (
            <div>
                <div>
                    <Select
                        labelId="city-select-label"
                        id="city-simple-select"
                        value={this.state.selectedCity}
                        label="Şehir"
                        onChange={this.handleSelectCity}
                    >
                        <MenuItem value={"Ankara"}>Ankara</MenuItem>
                        <MenuItem value={"İstanbul"}>İstanbul</MenuItem>
                        <MenuItem value={"İzmir"}>İzmir</MenuItem>
                    </Select>
                </div>
                <Map></Map>
                <br></br>
            </div>
        )
    }
}

export default MainPage
