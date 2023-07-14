import React, {useEffect, useRef, useState} from 'react';

import tagImg from '../assets/img/tag.png'
import {Badge, Dialog, Heading, Label, Pane, SideSheet, TextInputField,} from "evergreen-ui";
import {Form, useActionData, useLocation, useSearchParams, useSubmit} from "@remix-run/react";
import {store} from "~/lib/mobx";
import {observer} from "mobx-react";
import ImageInput from "~/components/ImageInput";
import Row from "~/components/Row";

const Tag = ({ tag }) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const submit = useSubmit();
    const actionData = useActionData();
    const location = useLocation();
    const deleteFor = useRef();

    const [selected, setSelected] = useState(store.hasSelectedItem(tag.id, location.pathname))
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const [title, setTitle] = useState(tag.title);
    const [color, setColor] = useState(tag.color);

    const image = tag.Media && tag.Media.length && tag.Media.find(media => media.name === 'image') ? [
        tag.Media.find(media => media.name === 'image').filename
    ] : []

    useEffect(() => {
        setSelected(store.hasSelectedItem(tag.id, location.pathname))
    }, [store.selectedItems.length])

    const handleSelect = checked => {
        setSelected(checked)

        if(selected) {
            store.unselectItem(tag.id, location.pathname)
        } else {
            store.selectItem(tag.id, location.pathname)
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
            actionData.data.updateTag && setIsEditOpen(false)
            actionData.data.deleteTags && setIsSureDeleteShown(false)
        }
    }, [actionData])


    const getImagePath = () => {
        return image.length ? `https://www.inshop-online.com/storage/${tag.uuid}/images/${image[0]}` : tagImg
    }

    const columns = [
        {
            width: 4,
            content: <Badge className="tag" color={tag.color}>
                <img src={getImagePath()}/>
                {tag.title}
            </Badge>,
        },
    ]

    return <Row
        handleCheck={handleSelect}
        checked={selected}
        id={tag.id}
        handleEdit={handleEdit}
        handlePreDelete={handlePreDelete}
        columns={columns}
        highlighted={searchParams.get('id') === tag.id}
        extend={<>
            <SideSheet
                width={500}
                isShown={isEditOpen}
                onCloseComplete={() => setIsEditOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <Pane padding={16} borderBottom="muted">
                    <Heading size={600}>Редактирование <b>#{tag.id}</b></Heading>
                </Pane>
                <Form method='post' encType={'multipart/form-data'} className="form">
                    <input type="hidden" name={'_action'} value={'update'}/>
                    <input type="hidden" name={'id'} value={tag.id}/>
                    <TextInputField
                        className={'field'}
                        label="Название"
                        name={'title'}
                        placeholder="Название..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextInputField
                        className={'field'}
                        label="Цвет"
                        name={'color'}
                        type={'color'}
                        placeholder="Цвет..."
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />

                    <Label marginBottom={4} marginTop={4} display="block">
                        Картинка
                    </Label>
                    <ImageInput
                        uuid={tag.uuid}
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
                Тег будет удален безвозвратно
                <Form ref={deleteFor} method="post">
                    <input type="hidden" name={'_action'} value={'delete'}/>
                    <input type="hidden" name={'id'} value={tag.id}/>
                </Form>
            </Dialog>
        </>}
    />;
};

export default observer(Tag);