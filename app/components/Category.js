import React, {useEffect, useRef, useState} from 'react';

import categoryImg from '../assets/img/category.png'
import {Dialog, Heading, Label, Pane, SideSheet, TextInputField,} from "evergreen-ui";
import {Form, useActionData, useLocation, useSearchParams, useSubmit} from "@remix-run/react";
import {store} from "~/lib/mobx";
import {observer} from "mobx-react";
import ImageInput from "~/components/ImageInput";
import Row from "~/components/Row";

const Category = ({ category }) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const submit = useSubmit();
    const actionData = useActionData();
    const location = useLocation();
    const deleteFor = useRef();

    const [selected, setSelected] = useState(store.hasSelectedItem(category.id, location.pathname))
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const [title, setTitle] = useState(category.title);

    const image = category.Media && category.Media.length && category.Media.find(media => media.name === 'image') ? [
        category.Media.find(media => media.name === 'image').filename
    ] : []

    useEffect(() => {
        setSelected(store.hasSelectedItem(category.id, location.pathname))
    }, [store.selectedItems.length])

    const handleSelect = checked => {
        setSelected(checked)

        if(selected) {
            store.unselectItem(category.id, location.pathname)
        } else {
            store.selectItem(category.id, location.pathname)
        }
    }

    const handleEdit = () => {
        setIsEditOpen(true)
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
            console.log(actionData.data)
            console.log(actionData.data.deleteCategories)
            actionData.data.updateCategory && setIsEditOpen(false)
            actionData.data.deleteCategories && setIsSureDeleteShown(false)
            console.log(isSureDeleteShown)
        }
    }, [actionData])

    const getImagePath = () => {
        return image.length ? `https://www.inshop-online.com/storage/${category.uuid}/images/${image[0]}` : categoryImg
    }

    const columns = [
        {
            width: 2,
            img: getImagePath(),
        },
        {
            width: 4,
            content: category.title,
        },
    ]

    return <Row
        handleCheck={handleSelect}
        checked={selected}
        id={category.id}
        handleEdit={handleEdit}
        handlePreDelete={handlePreDelete}
        columns={columns}
        highlighted={searchParams.get('id') === category.id}
        extend={<>
            <SideSheet
                width={500}
                isShown={isEditOpen}
                onCloseComplete={() => setIsEditOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <Pane padding={16} borderBottom="muted">
                    <Heading size={600}>Редактирование <b>#{category.id}</b></Heading>
                </Pane>
                <Form method='post' encType={'multipart/form-data'} className="form">
                    <input type="hidden" name={'_action'} value={'update'}/>
                    <input type="hidden" name={'id'} value={category.id}/>
                    <TextInputField
                        className={'field'}
                        label="Название"
                        name={'title'}
                        placeholder="Название..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <Label marginBottom={4} marginTop={4} display="block">
                        Картинка
                    </Label>
                    <ImageInput
                        uuid={category.uuid}
                        images={image}
                        name={'image'}
                    />

                    <div className="d-flex flex-end mt-1">
                        <button className="btn" type={'submit'}
                            // disabled={transition.state === "submitting"}
                        >Сохранить</button>
                    </div>
                </Form>
            </SideSheet>
            <Dialog
                isShown={isSureDeleteShown}
                title="Вы уверены?"
                intent="danger"
                onCloseComplete={() => setIsSureDeleteShown(false)}
                confirmLabel="Да"
                cancelLabel="Отмена"
                onConfirm={handleDelete}
                // hasFooter={false}
            >
                Категория будет удалена безвозвратно
                <Form ref={deleteFor} method="post">
                    <input type="hidden" name={'_action'} value={'delete'}/>
                    <input type="hidden" name={'id'} value={category.id}/>
                </Form>
            </Dialog>
        </>}
    />;
};

export default observer(Category);