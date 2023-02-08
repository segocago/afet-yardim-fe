import React, {Component} from 'react'
import Map from "./Map";
import {Button, Autocomplete, TextField} from "@mui/material";
import SiteService from "../services/SiteService";
import {CITIES} from "../constants/constants";
import CreateSiteDialog from "./CreateSiteDialog";

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCity: CITIES.find(city => city.label === "Ankara"),
            sites: [],
            centerLocation: [39.909442, 32.810491],
            createSiteDialogOpen: false
        }
    }


    handleSelectCity = (event, newValue) => {
        const lat = parseFloat(newValue.latitude);
        const lon = parseFloat(newValue.longitude);
        this.setState({selectedCity: newValue, centerLocation: [lat, lon]});
        SiteService.getSites(newValue.label).then((res) => {
            this.setState({sites: res.data});
        });
    }

    componentDidMount() {
        SiteService.getSites(this.state.selectedCity.label).then((res) => {
            this.setState({sites: res.data});
        });
    }

    handleCreateSiteDialogOpen = () => {
        this.setState({createSiteDialogOpen : true})
    }

    handleCreateSiteDialogClose = (formValues) => {
        console.log(formValues);
        this.setState({createSiteDialogOpen : false})
    }

    addCommentToSite = (event, siteId) => {
        event.preventDefault();
        let comment = {}
        comment.update = event.target[0].value;
        const {sites} = this.state;
        SiteService.addCommentToSite(siteId, comment)
            .then((res) => {
                let updatedSites = sites.map(site => {
                    if (site.id == siteId) {
                        site.updates.push(res.data)
                    }
                    return site;
                });
                this.setState({sites: updatedSites});
            });
    }

    render() {
        return (
            <div>
                <Autocomplete
                    style={{marginTop: 15}}
                    disablePortal
                    options={CITIES}
                    renderInput={(params) => <TextField {...params} label="Şehir" />}
                    onChange={this.handleSelectCity}
                    value={this.state.selectedCity}
                />
                <div>
                    <Button onClick={this.handleCreateSiteDialogOpen}>Yeni Yardım Noktası</Button>
                </div>
                <Map sites={this.state.sites} center={this.state.centerLocation} addCommentToSite={this.addCommentToSite}></Map>
                <CreateSiteDialog open={this.state.createSiteDialogOpen} handleClose={this.handleCreateSiteDialogClose}></CreateSiteDialog>
            </div>
        )
    }
}

export default MainPage
