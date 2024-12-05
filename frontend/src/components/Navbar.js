import React from 'react';
import { Link } from 'react-router-dom';
import '../style/style.scss';

function Navbar() {
    return (
        <nav className='navbar navbar-expand-lg bg-primary text-success'>
            <ul>
                <li><Link to="/">Search</Link></li>
                <li><Link to="/daily-recommendations">Daily Recommendations</Link></li>
                <li><Link to="/favorites">Favorites</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
