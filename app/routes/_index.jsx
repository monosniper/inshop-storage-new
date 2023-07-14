import globalStyles from "~/styles/global.css";
import styles from "~/styles/index.css";
import Layout from "~/components/Layout/Layout";
import {observer} from "mobx-react";
import {json} from "@remix-run/node";
import {getDomains, getShops} from "~/models/shop.server";
import {requireUser} from "~/utils/session.server";
import {getSession} from "~/sessions";
import Shops from "~/components/Shops";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {Heading, Label, Pane, SideSheet, TextInputField} from "evergreen-ui";
import React, {useEffect, useState} from "react";
import plusIcon from "~/assets/icons/add.svg";
import createIcon from "~/assets/icons/create.svg";
import {createShop, deleteShop, updateShop} from "~/models/shop.server";
import {toast} from "react-toastify";
import Select from "react-select";
import shopsIcon from "~/assets/icons/nav/index/shops.svg";
import domainsIcon from "~/assets/icons/nav/index/domains.svg";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

export const action = async ({ request }) => {
    const formData = await request.formData();
    const user = await requireUser(request)
    const session = await getSession(request.headers.get('Cookie'))
    const domain = session.get('domain')
    let result = null;

    switch (formData.get('_action')) {
        case 'update':
            const patch = {
                filters: { id: formData.get('id') },
                set: {
                    domainId: formData.get('domain'),
                    options: {
                        title: formData.get('title'),
                        language: formData.get('language'),
                        description: formData.get('description'),
                        currency: formData.get('currency'),
                    }
                },
                media: {
                    _preview: formData.get('_preview'),
                    favicon: formData.get('favicon'),
                }
            }

            result = await updateShop(domain, patch);
            break;
        case 'create':
            result = await createShop({
                userId: user.id,
                domainId: formData.get('domain'),
                options: {
                    title: formData.get('title'),
                    language: formData.get('language'),
                    description: formData.get('description'),
                    currency: formData.get('currency'),
                }
            });
            break;
        case "delete":
            result = await deleteShop(domain, formData.get('id'))
            break;
    }

    return result
};

export const loader = async ({ request }) => {
    const user = await requireUser(request)
    const session = await getSession(request.headers.get('Cookie'))
    const domain = session.get('domain')
    let shops = await getShops(domain, user.id);

    if(shops) shops = shops.data.shops
    else shops = []

    let domains = await getDomains(domain, user.id, true);

    if(domains) domains = domains.data.domains
    else domains = []

    return json({
        user,
        domain,
        shops,
        domains,
        subNav: [
            {
                pathname: '/',
                icon: shopsIcon,
                title: 'Магазины',
            },
            {
                pathname: '/domains',
                icon: domainsIcon,
                title: 'Доменные имена',
            },
        ],
    });
};

const _index = observer(() => {
    const actionData = useActionData()
    const {shops, domains} = useLoaderData()
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const languages = {
        ru: 'Русский',
        en: "English"
    }

    const currencies = ['$', '₴', '₽']

    const handleCreate = () => setIsCreateOpen(true)

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.updateShop && toast('Изменения сохранены')
            actionData.data.deleteShop && toast('Магазин удален')

            if(actionData.data.createShop) {
                setIsCreateOpen(false)
                toast('Магазин создан успешно')
            }
        }
    }, [actionData])

    return (
        <Layout>
            <div className="title">
                <div className="title__left"></div>
                <div className="title__right">
                    <button onClick={handleCreate} className="btn btn_create">
                        <img src={plusIcon}/>
                        <img className={'btn_create__img_min'} src={createIcon}/>
                        <span>Создать магазин</span>
                    </button>
                </div>
            </div>

            <Shops shops={shops} />

            <SideSheet
                width={500}
                isShown={isCreateOpen}
                onCloseComplete={() => setIsCreateOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <Pane padding={16} borderBottom="muted">
                    <Heading size={600}>Создание магазина</Heading>
                </Pane>
                <Form method='post' encType={'multipart/form-data'} className="form">
                    <input type="hidden" name={'_action'} value={'create'}/>
                    <TextInputField
                        className={'field'}
                        label="Название"
                        name={'title'}
                        placeholder="Название..."
                    />
                    <TextInputField
                        className={'field'}
                        name={'description'}
                        label="Описание"
                        type="text"
                        placeholder="Описание..."
                    />

                    <Label className={'lbl ub-mb_8px'}>Доменное имя</Label>
                    <Select
                        placeholder={'Выберите доменное имя'}
                        name={'domain'}
                        options={domains.map(({id: value, name, isSubdomain}) => {
                            return { value, label: isSubdomain ? name + '.inshop-app.site' : name }
                        })}
                    />

                    <Label className={'lbl ub-mb_8px'}>Валюта</Label>
                    <Select
                        placeholder={'Валюта'}
                        name={'currency'}
                        options={currencies.map(curr => {
                            return { value: curr, label: curr }
                        })}
                    />

                    <Label className={'lbl ub-mb_8px'}>Язык</Label>
                    <Select
                        placeholder={'Язык'}
                        name={'language'}
                        options={Object.keys(languages).map(value => {
                            return { value, label: languages[value] }
                        })}
                    />

                    <div className="d-flex flex-end mt-1">
                        <button className="btn" type={'submit'}
                            // disabled={transition.state === "submitting"}
                        >Сохранить</button>
                    </div>
                </Form>
            </SideSheet>
        </Layout>
    );
})

export default _index