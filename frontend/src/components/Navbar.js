import React from 'react';
import { Link } from 'react-router-dom';
import '../style/style.scss';

function Navbar() {
    return (
        <nav className='navbar navbar-expand-lg bg-primary'>
            <ul className='navbar-nav d-flex flex-row justify-content-around w-100'>
                <li className='nav-item'>
                    <Link to="/" className='nav-link text-success'>Search</Link>
                </li>
                <li className='nav-item'>
                    <Link to="/daily-recommendations" className='nav-link text-success'>Daily Recommendations</Link>
                </li>
                <li className='nav-item'>
                    <Link to="/favorites" className='nav-link text-success'>Favorites</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
