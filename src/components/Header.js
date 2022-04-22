import React from 'react';

export default function Header() {
    return (
        <nav className="main-header navbar navbar-expand navbar-dark navbar-primary fixed-top" style={{ backgroundColor: '#000233' }}>
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                </li>

                <li className="nav-item d-none d-sm-inline-block">
                    <a href="*" className="nav-link" style={{ color: '#F9CC00' }}>
                        NEXUS
                    </a>
                </li>

            </ul>
        </nav>

    )
}
