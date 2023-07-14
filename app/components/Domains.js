import React from 'react';
import Domain from "~/components/Domain";

const Domains = ({ domains }) => {
    console.log(domains)
    return (
        <div className={'rows'}>
            {domains.map(domain => (
                <Domain
                    domain={domain}
                    key={'domain-'+domain.id}
                />
            ))}
        </div>
    );
};

export default Domains;