import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import ViewSiteComponent from './components/ViewSiteComponent';
import MainPage from "./components/MainPage";

function App() {
    return (
        <div>
            <Router>
                <HeaderComponent/>
                <div className="container">
                    <Switch>
                        <Route path="/" exact component={MainPage}></Route>
                        <Route path="/view-site/:siteId" component={ViewSiteComponent}></Route>
                    </Switch>
                </div>
                <FooterComponent/>
            </Router>
        </div>

    );
}

export default App;
