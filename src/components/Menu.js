import React from 'react';
import { logout } from '../services/auth';

export default function Menu() {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{backgroundColor: '#000233'}}>
            {/* Brand Logo */}
            <a href="index3.html" className="brand-link" style={{color: '#F9CC00'}}>
                NEXUS
            </a>
            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar user panel (optional) */}
                {/* Sidebar Menu */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item has-treeview">
                            <a href="/" className="nav-link" onClick={() => logout()}>
                                <i className="nav-icon fas fa-sign-out-alt" />
                                Sair
                            </a>

                        </li>
                    </ul>
                </nav>
                {/* /.sidebar-menu */}
            </div>
            {/* /.sidebar */}
        </aside>

    )
}
