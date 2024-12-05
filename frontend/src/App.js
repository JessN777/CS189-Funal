import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Search from './pages/Search';
import Results from './pages/Results';
import DailyRecommendations from './pages/DailyRecommendations';
import Favorites from './pages/Favorites';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/results" element={<Results />} />
                <Route path="/daily-recommendations" element={<DailyRecommendations />} />
                <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </Router>
    );
}

export default App;
