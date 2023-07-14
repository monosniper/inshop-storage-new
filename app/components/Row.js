import React from 'react';
import {store} from "~/lib/mobx";
import editIcon from "~/assets/icons/edit.svg";
import deleteIcon from "~/assets/icons/delete.svg";
import Checkbox from "~/components/Checkbox";
import {observer} from "mobx-react-lite";

const Row = observer(({ highlighted, columns, extend, handleCheck, checked, id, handleEdit, handlePreDelete }) => {
    return <div className={'row ' + (highlighted ? 'row_highlight' : '')}>
        <div className="row__block">
            {(handleCheck !== undefined && checked !== undefined) && <div className="row__col row__col_1">
                <Checkbox handleCheck={handleCheck} checked={checked} />
            </div>}
            {id && <div className="row__col row__col_1 row__id row__number">{id}</div>}
            {columns.map(col => <div className={"row__col " + (col.width ? 'row__col_'+col.width : '') + (col.id ? ' row__id' : '') + (col.price ? ' row__price' : '') + (col.number ? ' row__number' : '')}>
                {col.content}
                {col.img && <div className="row__img" style={{backgroundImage: `url(${col.img})`}} />}
            </div>)}
        </div>
        <div className="row__btns">
            {handleEdit && <div className={"row__btn row__btn_edit " + (store.isSelectBarShown ? 'row__btn_disabled' : '')}
                  onClick={handleEdit}>
                <img src={editIcon}/>
            </div>}
            {handlePreDelete && <div className={"row__btn row__btn_delete " + (store.isSelectBarShown ? 'row__btn_disabled' : '')}
                  onClick={handlePreDelete}>
                <img src={deleteIcon}/>
            </div>}
        </div>
        {extend}
    </div>;
});

export default Row;