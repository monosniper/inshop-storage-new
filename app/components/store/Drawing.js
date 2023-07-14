import React from 'react';

const Drawing = ({ drawing }) => {
    return (
        <div
            className={'drawing'}
            style={{backgroundImage: `url('${drawing.img}')`}}>
        </div>
    );
};

export default Drawing;