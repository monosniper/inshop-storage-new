import React from 'react';
import {Link, useLoaderData, useLocation} from "@remix-run/react";
import {Position, Tooltip} from "evergreen-ui";

const SubNav = ({ className }) => {
    const loaderData = useLoaderData()
    const location = useLocation()

    return (
        <div className={('sub-nav ' + className)}>
            {loaderData.subNav.map(route => (
                <Tooltip key={'sub-'+route.pathname} content={route.title} position={Position.BOTTOM} showDelay={200}>
                    <Link to={route.pathname} className={"nav-item " + (location.pathname === route.pathname ? 'nav-item_active' : '')}>
                        <img src={route.icon}/>
                    </Link>
                </Tooltip>
            ))}
        </div>
    );
};

export default SubNav;