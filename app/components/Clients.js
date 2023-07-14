import React from 'react';
import Client from "~/components/Client";

const Clients = ({ clients }) => {
    return (
        <div className={'rows'}>
            {clients.map(client => (
                <Client
                    client={client}
                    key={'client-'+client.id}
                />
            ))}
        </div>
    );
};

export default Clients;