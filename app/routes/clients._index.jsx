import {json} from "@remix-run/node";
import {Form, useActionData, useLoaderData, useLocation} from "@remix-run/react";

import styles from "~/styles/global.css";
import clientsBlackImg from '../assets/icons/clients_black.svg'
import Layout from "~/components/Layout/Layout";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Heading, Pane, SideSheet, TextInputField} from "evergreen-ui";
import plusIcon from "~/assets/icons/add.svg";
import {store} from "~/lib/mobx";
import {getSession} from "~/sessions";
import {getShops} from "~/models/shop.server";
import {requireUser} from "~/utils/session.server";
import {createClient, deleteClient, deleteClients, getClients, updateClient} from "~/models/client.server";
import Clients from '../components/Clients'
import createIcon from "~/assets/icons/create.svg";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export const loader = async ({ request }) => {
    const { data: session } = await getSession(request.headers.get("Cookie"))

    const user = await requireUser(request)
    let clients = []
    const noties = []

    const { domain } = session

    if(domain) {
        clients = await getClients(domain)
        clients = clients.data.clients
    } else {
        noties.push({
            type: 'warning',
            message: 'Необходимо выбрать магазин'
        })
    }

    let shops = await getShops(domain, user.id);
    shops = shops.data.shops

    return json({
        clients,
        shops,
        domain,
        user,
        noties,
    });
};

export const action = async ({ request }) => {
    const session = await getSession(request.headers.get('Cookie'))
    const domain = session.get('domain')
    const formData = await request.formData();
    let result = null;

    switch (formData.get('_action')) {
        case 'update':
            const patch = {
                filters: { id: formData.get('id') },
                set: {
                    fio: formData.get('fio'),
                    email: formData.get('email'),
                    address: formData.get('address'),
                    age: Number(formData.get('age')),
                    phone: formData.get('phone'),
                },
                media: {
                    avatar: formData.get('avatar'),
                }
            }

            const password = formData.get('password');

            if (password) {
                patch.set.password = password
            }

            result = await updateClient(domain, patch);
            break;
        case 'create':
            result = await createClient(domain, {
                fio: formData.get('fio'),
                email: formData.get('email'),
                password: formData.get('password'),
                address: formData.get('address'),
                age: Number(formData.get('age')),
                phone: formData.get('phone'),
            });
            break;
        case "delete":
            result = await deleteClient(domain, formData.get('id'))
            break;
        case "deleteMany":
            result = await deleteClients(domain, formData.getAll('ids'))
            break;
    }

    return result
};

export default function ClientsPage() {
    const data = useLoaderData();
    const actionData = useActionData();
    const location = useLocation();
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const [fio, setFio] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleCreate = () => {
        setIsCreateOpen(true)
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            store.clearSelectedItems(location.pathname)

            actionData.data.updateClient && toast('Изменения сохранены')
            actionData.data.deleteClient && toast('Клиент удален')
            actionData.data.deleteClients && toast('Клиенты удалены')

            if(actionData.data.createClient) {
                setIsCreateOpen(false)
                toast('Клиент создан успешно')

                setFio(null)
                setAge(null)
                setEmail(null)
                setAddress(null)
                setPhone(null)
                setPassword(null)
            }
        }
    }, [actionData])

    return <Layout>
        <div className="title">
            <div className="title__left">
                <img src={clientsBlackImg}/>
                Клиенты
            </div>
            <div className="title__right">
                <button onClick={handleCreate} className="btn btn_create">
                    <img src={plusIcon}/>
                    <img className={'btn_create__img_min'} src={createIcon}/>
                    <span>Зарегистрировать клиента</span>
                </button>
            </div>
        </div>

        <Clients clients={data.clients}/>

        <SideSheet
            width={500}
            isShown={isCreateOpen}
            onCloseComplete={() => setIsCreateOpen(false)}
            shouldCloseOnOverlayClick={false}
        >
            <Pane padding={16} borderBottom="muted">
                <Heading size={600}>Регистрация клиента</Heading>
            </Pane>
            <Form method='post' encType={'multipart/form-data'} className="form">
                <input type="hidden" name={'_action'} value={'create'}/>
                <TextInputField
                    className={'field'}
                    label="ФИО"
                    name={'fio'}
                    placeholder="ФИО..."
                    value={fio}
                    onChange={(e) => setFio(e.target.value)}
                />
                <TextInputField
                    className={'field'}
                    name={'email'}
                    label="Почта"
                    type="email"
                    placeholder="E-mail адрес..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextInputField
                    className={'field'}
                    name={'address'}
                    label="Адрес"
                    placeholder="Адрес..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <div className="form__row">
                    <div className="form__col">
                        <TextInputField
                            className={'field'}
                            type={'number'}
                            name={'age'}
                            label="Возраст"
                            placeholder="Возраст..."
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="form__col">
                        <TextInputField
                            className={'field'}
                            type={'number'}
                            name={'phone'}
                            label="Номер"
                            placeholder="Номер телефона..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                <TextInputField
                    className={'field'}
                    name={'password'}
                    label="Пароль"
                    type="password"
                    placeholder="Пароль..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="d-flex flex-end mt-1">
                    <button className="btn" type={'submit'}
                        // disabled={transition.state === "submitting"}
                    >Сохранить</button>
                </div>
            </Form>
        </SideSheet>
    </Layout>;
}