import React from 'react';
import './App.css';
import {BrowserRouter as Router} from 'react-router-dom'
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import MainPage from "./components/MainPage";

function App() {
    return (
        <div>
            <Router>
                <HeaderComponent/>
                <div className="container">
                    <MainPage></MainPage>
                </div>
                <FooterComponent/>
            </Router>
        </div>

    );
}

export default App;
