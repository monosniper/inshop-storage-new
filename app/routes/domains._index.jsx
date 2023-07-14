import {json} from "@remix-run/node";
import {Form, useActionData, useLoaderData, useLocation} from "@remix-run/react";

import styles from "~/styles/global.css";
import domainsBlackImg from '../assets/icons/domains_black.svg'
import Layout from "~/components/Layout/Layout";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Heading, Label, Pane, SideSheet, TextInputField} from "evergreen-ui";
import plusIcon from "~/assets/icons/add.svg";
import {store} from "~/lib/mobx";
import {getSession} from "~/sessions";
import {getDomains, getShops} from "~/models/shop.server";
import {requireUser} from "~/utils/session.server";
import {createDomain, deleteDomain, deleteDomains} from "~/models/domain.server";
import Switch from "~/components/ui/Switch";
import Domains from "~/components/Domains";
import shopsIcon from "~/assets/icons/nav/index/shops.svg";
import domainsIcon from "~/assets/icons/nav/index/domains.svg";
import createIcon from "~/assets/icons/create.svg";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export const loader = async ({ request }) => {
    const { data: session } = await getSession(request.headers.get("Cookie"))

    const user = await requireUser(request)
    let domains = []
    const noties = []

    const { domain } = session

    domains = await getDomains(domain, user.id)
    domains = domains.data.domains

    let shops = await getShops(domain, user.id);
    shops = shops.data.shops

    return json({
        shops,
        domain,
        domains,
        user,
        noties,
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

export const action = async ({ request }) => {
    const formData = await request.formData();
    const user = await requireUser(request)
    const session = await getSession(request.headers.get('Cookie'))
    const domain = session.get('domain')
    let result = null;

    switch (formData.get('_action')) {
        case 'create':
            result = await createDomain(domain, {
                userId: user.id,
                name: formData.get('name'),
                isSubdomain: formData.get('isSubdomain') === 'true',
            });
            break;
        case "delete":
            result = await deleteDomain(domain, formData.get('id'))
            break;
        case "deleteMany":
            result = await deleteDomains(domain, formData.getAll('ids'))
            break;
    }

    return result
};

export default function DomainsPage() {
    const data = useLoaderData();
    const actionData = useActionData();
    const location = useLocation();
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const [name, setName] = useState();
    const [isSubdomain, setIsSubdomain] = useState(false);

    const handleCreate = () => {
        setIsCreateOpen(true)
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            store.clearSelectedItems(location.pathname)

            actionData.data.updateDomain && toast('Изменения сохранены')
            actionData.data.deleteDomain && toast('Доменное имя удалено')
            actionData.data.deleteDomains && toast('Доменные имена удалены')

            if(actionData.data.createDomain) {
                setIsCreateOpen(false)
                toast('Доменное имя добавлено успешно')

                setName(null)
            }
        }
    }, [actionData])

    return <Layout>
        <div className="title">
            <div className="title__left">
                <img src={domainsBlackImg}/>
                Доменные имена
            </div>
            <div className="title__right">
                <button onClick={handleCreate} className="btn btn_create">
                    <img src={plusIcon}/>
                    <img className={'btn_create__img_min'} src={createIcon}/>
                    <span>Зарегистрировать домен</span>
                </button>
            </div>
        </div>

        <Domains domains={data.domains} />

        <SideSheet
            width={500}
            isShown={isCreateOpen}
            onCloseComplete={() => setIsCreateOpen(false)}
            shouldCloseOnOverlayClick={false}
        >
            <Pane padding={16} borderBottom="muted">
                <Heading size={600}>Регистрация доменного имени</Heading>
            </Pane>
            <Form method='post' encType={'multipart/form-data'} className="form">
                <input type="hidden" name={'_action'} value={'create'}/>
                <TextInputField
                    className={'field'}
                    label="Имя"
                    name={'name'}
                    placeholder="Имя..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Label className={'lbl ub-mb_8px'}>Поддомен (<b>{name || '*'}</b>.inshop-app.site)</Label>
                <Switch onChange={checked => setIsSubdomain(checked)} />
                <input type="hidden" name={'isSubdomain'} value={isSubdomain}/>
                <div className="d-flex flex-end mt-1">
                    <button className="btn" type={'submit'}
                        // disabled={transition.state === "submitting"}
                    >Сохранить</button>
                </div>
            </Form>
        </SideSheet>
    </Layout>;
}