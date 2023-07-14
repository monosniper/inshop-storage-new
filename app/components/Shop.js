import React, {useEffect, useRef, useState} from 'react';
import SettingsIcon from '../assets/icons/settings.svg'
import {Dialog, Heading, Label, Pane, SideSheet, TextInputField} from "evergreen-ui";
import {Form, useActionData, useLoaderData, useSubmit} from "@remix-run/react";
import ImageInput from "~/components/ImageInput";
import shopFaviconImg from "~/assets/img/shop_icon.png";
import shopPreviewImg from "~/assets/img/shop.png";
import Select from "react-select";

const Shop = ({ shop }) => {
    const languages = {
        ru: 'Русский',
        en: "English"
    }

    const submit = useSubmit()
    const actionData = useActionData()
    const {domains} = useLoaderData()
    const deleteFor = useRef()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)
    const [title, setTitle] = useState(shop.options.title)
    const [description, setDescription] = useState(shop.options.description)
    const [domain, setDomain] = useState({value: shop.Domain.id, label: shop.Domain.name})
    const [currency, setCurrency] = useState({value: shop.options.currency, label: shop.options.currency})
    const [language, setLanguage] = useState({value: shop.options.language, label: languages[shop.options.language]})

    const preview = shop.Media && shop.Media.length && shop.Media.find(media => media.name === '_preview') ? [
        shop.Media.find(media => media.name === '_preview').filename
    ] : []

    const favicon = shop.Media && shop.Media.length && shop.Media.find(media => media.name === 'favicon') ? [
        shop.Media.find(media => media.name === 'favicon').filename
    ] : []

    const handleEdit = () => {
        setIsEditOpen(true)
    }

    const handlePreDelete = () => {
        setIsSureDeleteShown(true)
    }

    const handleDelete = () => {
        setIsSureDeleteShown(false)
        setIsEditOpen(false)
        submit(deleteFor.current, { replace: true });
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.updateShop && setIsEditOpen(false)
            actionData.data.deleteShop && setIsSureDeleteShown(false)
        }
    }, [actionData])

    const getFaviconPath = () => {
        return favicon.length ? `https://www.inshop-online.com/storage/${shop.uuid}/images/${favicon[0]}` : shopFaviconImg
    }

    const getPreviewPath = () => {
        return preview.length ? `https://www.inshop-online.com/storage/${shop.uuid}/images/${preview[0]}` : shopPreviewImg
    }

    const url = shop.Domain.isSubdomain ? shop.Domain.name + '.inshop-app.site' : shop.Domain.name

    const currencies = ['$', '₴', '₽']

    return (
        <>
            <div className={'shop'}>
                <div className="shop__preview" style={{backgroundImage: 'url('+getPreviewPath()+')'}}></div>
                <div className="shop__bottom">
                    <div className="shop__head">
                        <div className="shop__icon">
                            <img src={getFaviconPath()}/>
                        </div>
                        <div className="shop__info">
                            <div className="shop__title">{shop.options.title}</div>
                            <a className="shop__link" href={"http://"+url} target={'_blank'}>{url}</a>
                        </div>
                    </div>
                    <div className="shop__footer">
                        <button onClick={handleEdit} className="shop__btn">
                            <img src={SettingsIcon}/>
                        </button>
                    </div>
                </div>
            </div>
            <SideSheet
                width={500}
                isShown={isEditOpen}
                onCloseComplete={() => setIsEditOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <Pane padding={16} borderBottom="muted">
                    <Heading size={600}>Редактирование <b>{shop.options.title}</b></Heading>
                </Pane>
                <Form method='post' encType={'multipart/form-data'} className="form">
                    <input type="hidden" name={'_action'} value={'update'}/>
                    <input type="hidden" name={'id'} value={shop.id}/>
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
                        name={'description'}
                        label="Описание"
                        type="text"
                        placeholder="Описание..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Label className={'lbl ub-mb_8px'}>Доменное имя</Label>
                    <Select
                        placeholder={'Выберите доменное имя'}
                        name={'domain'}
                        onChange={(e) => setDomain(e.value)}
                        defaultValue={domain}
                        options={domains.map(({id: value, name: label}) => {
                            return { value, label }
                        })}
                    />

                    <Label className={'lbl ub-mb_8px'}>Валюта</Label>
                    <Select
                        placeholder={'Валюта'}
                        name={'currency'}
                        onChange={(e) => setCurrency(e.value)}
                        defaultValue={currency}
                        options={currencies.map(curr => {
                            return { value: curr, label: curr }
                        })}
                    />

                    <Label className={'lbl ub-mb_8px'}>Язык</Label>
                    <Select
                        placeholder={'Язык'}
                        name={'language'}
                        onChange={(e) => setLanguage(e.value)}
                        defaultValue={language}
                        options={Object.keys(languages).map(value => {
                            return { value, label: languages[value] }
                        })}
                    />

                    <Label marginBottom={4} marginTop={4} display="block">
                        Фавикон
                    </Label>
                    <ImageInput
                        uuid={shop.uuid}
                        images={favicon}
                        name={'favicon'}
                    />

                    <Label marginBottom={4} marginTop={4} display="block">
                        Превью на складе
                    </Label>
                    <ImageInput
                        uuid={shop.uuid}
                        images={preview}
                        name={'_preview'}
                    />

                    <div className="d-flex flex-between mt-1">
                        <button onClick={handlePreDelete} className="btn btn_red" type={'button'}
                            // disabled={transition.state === "submitting"}
                        >Удалить магазин</button>
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
                Магазин будет удален навсегда
                <Form ref={deleteFor} method="post">
                    <input type="hidden" name={'_action'} value={'delete'}/>
                    <input type="hidden" name={'id'} value={shop.id}/>
                </Form>
            </Dialog>
        </>
    );
};

export default Shop;