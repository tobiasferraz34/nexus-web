import React from 'react';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{backgroundColor: '#000233'}}>
            <div className="container">
                <a className="navbar-brand" href="/" style={{color: '#F9CC00'}}>
                    NEXUS
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="btn btn-outline-light btn-sm" href="/">Página Inicial</a>
                        </li>
                    </ul>
                </div>

            </div>
            
        </nav>
    )
}