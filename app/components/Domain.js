import React, {useEffect, useRef, useState} from 'react';

import {Dialog} from "evergreen-ui";
import {Form, useActionData, useLocation, useSubmit} from "@remix-run/react";
import {store} from "~/lib/mobx";
import {observer} from "mobx-react";
import Row from "~/components/Row";

const Client = ({ domain }) => {
    const submit = useSubmit();
    const actionData = useActionData();
    const deleteFor = useRef();
    const location = useLocation()

    const [selected, setSelected] = useState(store.hasSelectedItem(domain.id, location.pathname))
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    useEffect(() => {
        setSelected(store.hasSelectedItem(domain.id, location.pathname))
    }, [store.selectedItems.length])

    const handleSelect = checked => {
        setSelected(checked)

        if(selected) {
            store.unselectItem(domain.id, location.pathname)
        } else {
            store.selectItem(domain.id, location.pathname)
        }
    }

    const handlePreDelete = () => {
        setIsSureDeleteShown(true)
    }

    const handleDelete = () => {
        setIsSureDeleteShown(false)
        submit(deleteFor.current, { replace: true });
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.deleteDomain && setIsSureDeleteShown(false)
            actionData.data.deleteDomains && setIsSureDeleteShown(false)
        }
    }, [actionData])

    const url = domain.isSubdomain ? domain.name + '.inshop-app.site' : domain.name

    const columns = [
        {
            content: <a className={'link'} target={'_blank'} href={'http://'+url}>{url}</a>,
        },
        {
            // Current shop
            content: <></>,
        },
        {
            // Состояние - активен (днс направлен)
            content: <></>,
        },
    ]

    return (
        <Row
            columns={columns}
            handleCheck={handleSelect}
            checked={selected}
            id={domain.id}
            handlePreDelete={handlePreDelete}
            extend={<Dialog
                isShown={isSureDeleteShown}
                title="Вы уверены?"
                intent="danger"
                onCloseComplete={() => setIsSureDeleteShown(false)}
                confirmLabel="Да"
                cancelLabel="Отмена"
                onConfirm={handleDelete}
                // hasFooter={false}
            >
                Доменное имя будет удалено навсегда
                <Form ref={deleteFor} method="post">
                    <input type="hidden" name={'_action'} value={'delete'}/>
                    <input type="hidden" name={'id'} value={domain.id}/>
                </Form>
            </Dialog>}
        />
    );
};

export default observer(Client);