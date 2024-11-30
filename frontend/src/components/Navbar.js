import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Search</Link></li>
                <li><Link to="/daily-recommendations">Daily Recommendations</Link></li>
                <li><Link to="/favorites">Favorites</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
