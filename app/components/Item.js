import React, {useState} from 'react';
import {Dialog} from "evergreen-ui";

const Item = ({ page }) => {
    const [isShown, setIsShown] = useState(false)

    return <>
        <Dialog
            isShown={isShown}
            title={page.title}
            onCloseComplete={() => setIsShown(false)}
            hasFooter={false}
        >
            {Object.entries(page).filter(([slug]) => slug !== 'title').map(([slug, value], i) => <div key={'ee-bitch-nigga-'+slug+'-'+i} className={'item__row'}>
                <div className={'item__slug'}>{slug}</div>
                <div className={'item__value'}>{value}</div>
            </div>)}
        </Dialog>

        <div onClick={() => setIsShown(true)} className={'item'}>{page.title}</div>
    </>;
};

export default Item;