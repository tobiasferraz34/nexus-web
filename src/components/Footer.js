import { FaPhoneAlt, FaInstagram, FaFacebook } from "react-icons/fa";

import React from 'react';
import Logo from '../assets/logo.png';

export default function Footer() {
    return (
        <div className="jumbotron" style={styles.footer}>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-4">
                        <h5><img src={Logo}/></h5>
                    </div>

                    <div className="col-12 col-sm-12 col-md-4">
                        <h5>Redes Sociais</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="link-rodape" target="_blank"><FaInstagram/> Instagram</a></li>
                            <li><a href="#" className="link-rodape" target="_blank"><FaFacebook/> Facebook</a></li>
                        </ul>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4">
                        <h5><FaPhoneAlt /> (xx) xxxxx-xxxx</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {     
    footer: {
        marginTop: '10px',
        backgroundColor: '#fff'
    }
}
