import React, {useEffect, useRef, useState} from 'react';

import deleteIcon from '~/assets/icons/black_delete.svg'
import closeIcon from '~/assets/icons/close.svg'
import {observer} from "mobx-react";
import {store} from "~/lib/mobx";
import {Form, useActionData, useLocation, useSubmit} from "@remix-run/react";
import {Dialog} from "evergreen-ui";
import {$routes} from "~/utils/config";

const SelectBar = () => {
    const deleteForm = useRef()
    const submit = useSubmit()
    const actionData = useActionData()
    const location = useLocation()
    const page_with_select = [
        $routes.storage.index,
        $routes.storage.categories,
        $routes.storage.tags,
        $routes.clients,
        $routes.domains,
    ]
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const handleClose = () => {
        store.clearSelectedItems(location.pathname)
        store.setIsSelectBarShown(false)
    }

    const handleDelete = () => {
        store.setIsSelectBarShown(false)
        submit(deleteForm.current, { replace: true });
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            setIsSureDeleteShown(false)
        }
    }, [actionData])

    useEffect(() => {
        page_with_select.includes(location.pathname) && store.setIsSelectBarShown(!!store.selectedItems.filter(i => i.name === location.pathname).length)
    }, [location.pathname, store.selectedItems.length])

    return (
        <div className={'select-bar ' + (store.isSelectBarShown ? '' : 'select-bar_hidden')}>
            <Dialog
                isShown={isSureDeleteShown}
                title="Вы уверены?"
                intent="danger"
                onCloseComplete={() => setIsSureDeleteShown(false)}
                confirmLabel="Да"
                cancelLabel="Отмена"
                onConfirm={handleDelete}
            >
                {store.selectedItems.filter(i => i.name === location.pathname).length} элементов будут удалены безвозвратно
                <Form ref={deleteForm} method="post">
                    <input type="hidden" name={'_action'} value={'deleteMany'}/>
                    {[...store.selectedItems.filter(i => i.name === location.pathname)].map(id => <input key={'Item-ids-'+id.key} type="hidden" name={'ids'} value={id.key} />)}
                </Form>
            </Dialog>

            <div className="container select-bar__wrapper">
                <div className="select-bar__col">
                    {store.selectedItems.filter(i => i.name === location.pathname).length} элемента(ов) выбрано
                </div>
                <div className="select-bar__col">
                    <button onClick={() => setIsSureDeleteShown(true)} className="select-bar__btn select-bar__btn_min">
                        <img src={deleteIcon} />
                    </button>
                    <button onClick={handleClose} className="select-bar__btn">
                        <img src={closeIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(SelectBar);