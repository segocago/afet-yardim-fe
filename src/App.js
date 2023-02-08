import axios from "axios";

import "./App.css";
import React from "react";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      siteData: [],
      name: "",
      organizer: "",
      city: "",
      district: "",
      additionalAddress: "",
      contactInformation: "",
      description: "",
    };
  }
  componentDidMount() {
    axios
      .get(
        "http://afetyardim-env.eba-vh65vafd.eu-central-1.elasticbeanstalk.com/sites"
      )
      .then((data) => this.setState({ siteData: data.data }))
      .catch((e) => {
        console.log(e);
      });
  }

  renderSites = () => {
    return (
      this.state.siteData.length > 0 &&
      this.state.siteData?.map((datum) => {
        return (
          <tr key={datum.id}>
            <td>{datum.name}</td>
            <td>{datum.location.city}</td>
            <td>{datum.location.district}</td>
            <td>{datum.location.additionalAddress}</td>
            <td>{datum.organizer}</td>
            <td>{datum.description}</td>
            <td>{datum.contactInformation}</td>
            {datum.updates?.length > 0 && (
              <td>{datum.updates[datum.updates.length - 1].update}</td>
            )}
          </tr>
        );
      })
    );
  };

  handleAddSite = () => {
    if (
      !this.state.contactInformation ||
      !this.state.organizer ||
      !this.state.city ||
      !this.state.district ||
      !this.state.additionalAddress ||
      !this.state.contactInformation
    ) {
      alert("Lütfen gerekli alanları kontrol ediniz");
    } else {
      axios
        .post(
          "http://afetyardim-env.eba-vh65vafd.eu-central-1.elasticbeanstalk.com/sites",
          {
            name: this.state.name,
            organizer: this.state.organizer,
            location: {
              city: this.state.city,
              district: this.state.district,
              additionalAddress: this.state.additionalAddress,
              // longitude: 32.70241106036951,
              // latitude: 39.99047880527539,
            },
            description: this.state.description,
            contactInformation: "test contact",
          }
        )
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  handleContactChange = (e) => {
    this.setState({ contactInformation: e.target.value });
  };

  handleNotesChange = (e) => {
    this.setState({ description: e.target.value });
  };

  handleOrganizerChange = (e) => {
    this.setState({ organizer: e.target.value });
  };

  handleAddressChange = (e) => {
    this.setState({ additionalAddress: e.target.value });
  };

  handleDistrictChange = (e) => {
    this.setState({ district: e.target.value });
  };

  handleCityChange = (e) => {
    this.setState({ city: e.target.value });
  };

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    console.log("Data is ", this.state.siteData);
    return (
      <>
        <div className="title">Yardım Toplama Noktaları</div>

        <table className="sites-table">
          <thead>
            <tr>
              <th>Toplanma Noktası</th>
              <th>İl</th>
              <th>İlçe</th>
              <th>Adres</th>
              <th>Organizatör</th>
              <th>Notlar</th>
              <th>İletişim</th>
              <th>Son güncelleme</th>
            </tr>
          </thead>

          <tbody>{this.renderSites()}</tbody>
        </table>
        {/* <table className="no-border"> */}
        {/* <tr> */}
        <div className="form">
          <div className="site-input-container">
            Toplanma Noktası
            <div>
              <input
                className="site-input"
                onChange={(e) => this.handleNameChange(e)}
              ></input>
            </div>
          </div>
          <div className="site-input-container">
            İl
            <div>
              <input
                className="site-input"
                onChange={(e) => this.handleCityChange(e)}
              ></input>
            </div>
          </div>
          <div className="site-input-container">
            İlçe
            <div>
              <input
                className="site-input"
                onChange={(e) => this.handleDistrictChange(e)}
              ></input>
            </div>
          </div>
          <div className="site-input-container">
            Adres
            <div>
              <input
                className="site-input"
                onChange={(e) => this.handleAddressChange(e)}
              ></input>
            </div>
          </div>
          <div className="site-input-container">
            Organizatör
            <div>
              <input
                className="site-input"
                onChange={(e) => this.handleOrganizerChange(e)}
              ></input>
            </div>
          </div>
          <div className="site-input-container">
            Notlar
            <div>
              <input
                className="site-input"
                onChange={(e) => this.handleNotesChange(e)}
              ></input>
            </div>
          </div>
          <div className="site-input-container">
            İletişim
            <div>
              <input
                className="site-input"
                onChange={(e) => this.handleContactChange(e)}
              ></input>
            </div>
          </div>

          <div className="add-new-site-bt-container">
            <button className="add-new-site-bt" onClick={this.handleAddSite}>
              Ekle
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default App;
