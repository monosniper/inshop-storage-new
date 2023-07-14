import React from 'react';

import homeIcon from '~/assets/icons/nav/home.svg';
import storageIcon from '~/assets/icons/nav/storage.svg';
import shopIcon from '~/assets/icons/nav/shop.svg';
import libraryIcon from '~/assets/icons/nav/library.svg';
import walletIcon from '~/assets/icons/nav/wallet.svg';
import clientsIcon from '~/assets/icons/nav/clients.svg';
import {Link, useLocation} from "@remix-run/react";
import {Position, Tooltip} from "evergreen-ui";
import {$routes} from "~/utils/config";

const Navigation = () => {
    const location = useLocation()

    const routes = [
        {
            pathname: $routes.index,
            icon: homeIcon,
            title: 'Дом',
        },
        {
            pathname: $routes.storage.index,
            icon: storageIcon,
            title: 'Склад',
        },
        {
            pathname: $routes.store.index,
            icon: shopIcon,
            title: 'Магазин',
        },
        {
            pathname: $routes.library.index,
            icon: libraryIcon,
            title: 'Библиотека',
        },
        {
            pathname: $routes.wallet,
            icon: walletIcon,
            title: 'Финансы',
        },
        {
            pathname: $routes.clients,
            icon: clientsIcon,
            title: 'Клиенты',
        },
    ]

    const loc = location.pathname;

    const isActive = (pathname) =>
        pathname === $routes.index
            ? loc === pathname
            : loc === pathname || loc.startsWith(pathname)

    return (
        <div className={'nav'}>
            {routes.map(route => (
                <Tooltip key={route.pathname} content={route.title} position={Position.RIGHT} showDelay={200}>
                    <Link to={route.pathname} className={"nav-item " + (isActive(route.pathname) ? 'nav-item_active' : '')}>
                        <img src={route.icon}/>
                    </Link>
                    {/*<a key={route.pathname} href={route.pathname} className={"nav-item " + (location.pathname === route.pathname ? 'nav-item_active' : '')}>*/}
                    {/*    <img src={route.icon}/>*/}
                    {/*</a>*/}
                </Tooltip>
            ))}
        </div>
    );
};

export default Navigation;