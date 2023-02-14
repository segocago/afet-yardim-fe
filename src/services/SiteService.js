import axios from "axios";

const SITES_API_BASE_URL = "https://pfkuirisqb.execute-api.eu-central-1.amazonaws.com/sites/v2";
// const SITES_API_BASE_URL = "http://localhost:8080/sites/v2";
class SiteService {
  getSites(cityName) {
    return axios.get(`${SITES_API_BASE_URL}?cityFilter=${cityName}`);
  }

  createSite(site) {
    return axios.post(SITES_API_BASE_URL, site);
  }

  getSiteById(siteId) {
    return axios.get(`${SITES_API_BASE_URL}/${siteId}`);
  }

  addCommentToSite(siteId, comment) {
    return axios.post(`${SITES_API_BASE_URL}/${siteId}/updates`, comment);
  }
}

export default new SiteService();
