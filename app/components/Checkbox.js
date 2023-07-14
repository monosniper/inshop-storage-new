import React from 'react';

import checkIcon from '../assets/icons/check.svg'

const Checkbox = ({ handleCheck, checked }) => {
    return (
        <div className={'my-checkbox'}>
            <input type="checkbox" checked={checked}/>
            <label onClick={(e) => handleCheck(!checked)} className="checkbox">
                <img src={checkIcon}/>
            </label>
        </div>
    );
};

export default Checkbox;