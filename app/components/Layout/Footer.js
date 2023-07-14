import React from 'react';

import homeIcon from '../../assets/icons/nav/home.svg'
import storageIcon from '../../assets/icons/nav/storage.svg'
import shopIcon from '../../assets/icons/nav/shop.svg'
import libraryIcon from '../../assets/icons/nav/library.svg'
import walletIcon from '../../assets/icons/nav/wallet.svg'
import clientsIcon from '../../assets/icons/nav/clients.svg'

const Footer = () => {
    return (
        <footer className={'carousel'}>
            <div className="nav">
                <div className="nav-btn">
                    <img src={homeIcon} />
                </div>
                <div className="nav-btn nav-btn_active">
                    <img src={storageIcon} />
                </div>
                <div className="nav-btn">
                    <img src={shopIcon} />
                </div>
                <div className="nav-btn">
                    <img src={libraryIcon} />
                </div>
                <div className="nav-btn">
                    <img src={walletIcon} />
                </div>
                <div className="nav-btn">
                    <img src={clientsIcon} />
                </div>
            </div>
        </footer>
    );
};

export default Footer;