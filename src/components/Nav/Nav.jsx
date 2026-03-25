import React from 'react';
import './Nav.css';
import logo from './../../Assets/logo.png';

const Nav = () => {
    return (
        <div className="nav-container">
            <div className="nav-left">
                <img className="flash-logo" src={logo} alt="logo" />
                <p className="flash-logo-text">Flashtype</p>
            </div>
            <div className="nav-right">
                <a
                    target="_blank"
                    className="nav-li-link"
                    href="https://www.linkedin.com/in/anupam-patra-921634ab/"
                    rel="noreferrer">
                    AP
                </a>
            </div>
        </div>
    )
}


export default Nav;