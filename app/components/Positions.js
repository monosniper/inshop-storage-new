import React from 'react';
import Position from "~/components/Position";

const Positions = ({ positions, categories }) => {
    return (
        <div className={'rows'}>
            {positions.map(position => (
                <Position
                    position={position}
                    categories={categories}
                    key={'position-'+position.id}
                />
            ))}
        </div>
    );
};

export default Positions;