import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Map from "./view/map/Map";
import Diashow from "./view/diashow/Diashow";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Map />} />
                <Route path="/getPictures" element={<Diashow />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
