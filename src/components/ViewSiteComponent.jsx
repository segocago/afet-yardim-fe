import React, {Component} from 'react'
import SiteService from "../services/SiteService";

class ViewSiteComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            siteId: this.props.match.params.siteId,
            site: {}
        }
    }

    componentDidMount() {
        SiteService.getSiteById(this.state.siteId).then(res => {
            this.setState({site: res.data});
        })
    }

    render() {
        return (
            <div>
                <br></br>
                <div className="card col-md-6 offset-md-3">
                    <h3 className="text-center"> View Employee Details</h3>
                    <div className="card-body">
                        <div className="row">
                            <label> Site Name: </label>
                            <div> {this.state.site.name}</div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default ViewSiteComponent
