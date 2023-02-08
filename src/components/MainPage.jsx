import React, {Component} from 'react'
import Map from "./Map";
import {MenuItem, Select} from "@mui/material";
import SiteService from "../services/SiteService";

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCity: [],
            sites: []
        }
    }

    handleSelectCity = city => {
        this.setState({selectedCity: city});
    }

    viewSite(siteId) {
        this.props.history.push(`/view-site/${siteId}`);
    }

    componentDidMount() {
        SiteService.getSites().then((res) => {
            this.setState({sites: res.data});
        });
    }

    render() {
        return (
            <div>
                <Map></Map>
                <br></br>
                <div>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.selectedCity}
                        label="City"
                        onChange={this.handleSelectCity}
                    >
                        <MenuItem value={"Ankara"}>Ankara</MenuItem>
                        <MenuItem value={"İstanbul"}>İstanbul</MenuItem>
                        <MenuItem value={"İzmir"}>İzmir</MenuItem>
                    </Select>
                </div>
            </div>
        )
    }
}

export default MainPage
