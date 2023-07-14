import React from 'react';
import Shop from "~/components/Shop";

const Shops = ({ shops }) => {
    return (
        <div className={'shops'}>
            {shops.map((shop, i) => <Shop key={'shop-'+i} shop={shop} />)}
        </div>
    );
};

export default Shops;