import React, {Component} from 'react'
import SiteService from '../services/SiteService'

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCity: [],
            sites: []
        }
    }

    onSelectCity = city => {
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
                <h2 className="text-center">Deprem Yardım Uygulaması</h2>
                <br></br>
                <div className="row">
                    <table className="table table-striped table-bordered">

                        <thead>
                        <tr>
                            <th> Employee First Name</th>
                            <th> Employee Last Name</th>
                            <th> Employee Email Id</th>
                            <th> Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.employees.map(
                                employee =>
                                    <tr key={employee.id}>
                                        <td> {employee.firstName} </td>
                                        <td> {employee.lastName}</td>
                                        <td> {employee.emailId}</td>
                                        <td>
                                            <button onClick={() => this.editEmployee(employee.id)}
                                                    className="btn btn-info">Update
                                            </button>
                                            <button style={{marginLeft: "10px"}}
                                                    onClick={() => this.deleteEmployee(employee.id)}
                                                    className="btn btn-danger">Delete
                                            </button>
                                            <button style={{marginLeft: "10px"}}
                                                    onClick={() => this.viewEmployee(employee.id)}
                                                    className="btn btn-info">View
                                            </button>
                                        </td>
                                    </tr>
                            )
                        }
                        </tbody>
                    </table>

                </div>

            </div>
        )
    }
}

export default MainPage
