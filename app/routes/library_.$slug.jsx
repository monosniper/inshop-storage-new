import React, {useEffect, useRef, useState} from 'react';
import globalStyles from "~/styles/global.css";
import storeStyles from "~/styles/pages/store.css";
import styles from "~/styles/pages/library.css";
import {requireUser} from "~/utils/session.server";
import {getSession} from "~/sessions";
import {getShops} from "~/models/shop.server";
import {json} from "@remix-run/node";
import {getModule, activateModule, deactivateModule, getModules, saveModule} from "~/models/module.server";
import {Form, useActionData, useLoaderData, useSubmit} from "@remix-run/react";
import LibraryLayout from "~/components/Layout/LibraryLayout";
import Switch from "~/components/ui/Switch";
import {toast} from "react-toastify";
import Item from "../components/Item";
import qs from "qs";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: storeStyles },
        { rel: "stylesheet", href: styles },
    ];
}

export const action = async ({ request }) => {
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session
    const text = await request.text();
    const data = qs.parse(text)

    const actions = {
        activate: activateModule,
        deactivate: deactivateModule,
    }

    const { _action, id, options } = data

    if (_action === 'save') {
        return await saveModule(domain, JSON.parse(options), id);
    } else if(_action === 'add') {
        return await saveModule(domain, options, id);
    } else {
        return await actions[_action](domain, id);
    }
};

export const loader = async ({ request, params }) => {
    const user = await requireUser(request)
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session
    let module
    const noties = []
    let modules = []
    let shops = await getShops(domain, user.id);
    shops = shops.data.shops

    if(domain) {
        module = await getModule(domain, params.slug)
        module = module.data.module

        modules = await getModules(domain, true)
        modules = modules.data.modules
    } else {
        noties.push({
            type: 'warning',
            message: 'Необходимо выбрать магазин'
        })
    }

    return json({
        user,
        domain,
        shops,
        module,
        modules,
        noties,
    });
};

const slugField = (field, value, onChange, handleAdd=()=>{}, options,
                   index, addForm, moduleId) => {
    const itemFields = {
        input: ({label, slug}, mainSlug, index) => <div className="slug__field">
            <label>{label}</label>
            <input name={`options[${mainSlug}][${index}][${slug}]`} type="text" />
        </div>,
        textarea: ({label, slug}, mainSlug, index) => <div className="slug__field">
            <label>{label}</label>
            <textarea name={`options[${mainSlug}][${index}][${slug}]`} />
        </div>,
    }

    const fields = {
        input: <div className="slug__field">
            <label>{field.label}</label>
            <input value={value} onChange={(value) => onChange(value, field.slug)} defaultValue={field.defaultValue} type="text"/>
        </div>,
        switch: <div className="slug__switch">
            <label>{field.label}</label>
            <Switch onChange={(value) => onChange(value, field.slug)} defaultChecked={field.defaultValue} />
        </div>,
        items: <div className="slug__field">
            <label>{field.label}</label>
            <Form ref={addForm} method="post">
                <input type="hidden" name={'_action'} value={'add'}/>
                <input type="hidden" name={'id'} value={moduleId}/>
                {options[field.slug].map((page, i) => {
                    return Object.entries(page).map(([slug, value]) => <input
                        key={'old-option-key-'+slug}
                        type="hidden"
                        name={`options[${field.slug}][${i}][${slug}]`}
                        value={value}
                    />)
                })}
                {field.fields?.map((item) => itemFields[item.type](item, field.slug, index))}
            </Form>
            <button style={{marginTop: 15}} onClick={handleAdd} className="btn">Добавить</button>
            <div className={'items'}>
                {options[field.slug].map((page, i) => <Item key={'page-'+i} page={page} />)}
            </div>
        </div>
    }

    return fields[field.type]
}

const ModulePage = () => {
    const loaderData = useLoaderData()
    const actionData = useActionData()
    const module = loaderData.module
    const [options, setOptions] = useState(module.options)
    const [showedToast, setShowedToast] = useState(false)

    useEffect(() => {
        const newOptions = {...options}
        module.default_options?.fields.forEach(field => {
            if(!newOptions[field.slug]) newOptions[field.slug] = field.defaultValue
        })
        setOptions(newOptions)
    }, [])

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.activateModule && !showedToast && toast('Модуль был активирован'); setShowedToast(true)
            actionData.data.deactivateModule && !showedToast && toast('Модуль был деактивирован'); setShowedToast(true)
            actionData.data.saveModule && !showedToast && toast('Изменения сохранены'); setShowedToast(true)
        }
    }, [actionData])

    const submit = useSubmit();
    const moduleActivationForm = useRef();
    const moduleOptionsForm = useRef();
    const addForm = useRef();

    const image = module.Media?.length && module.Media.find(media => media.name === 'image') ? [
        module.Media.find(media => media.name === 'image').filename
    ] : []

    const onOptionsChange = (e, slug) => {
        const newOptions = {...options}
        newOptions[slug] = e.target.value
        setOptions(newOptions)
    }

    const toggle = () => submit(moduleActivationForm.current, { replace: true });
    const save = () => submit(moduleOptionsForm.current, { replace: true });
    const handleAdd = () => submit(addForm.current, { replace: true });

    return <LibraryLayout>
        <div className="slug__title">
            <div>
                <span>{module.title}</span>
                <span>
                    <Switch onChange={toggle} defaultChecked={module.isActive} />
                </span>
            </div>
            <div>
                <a href={`/store/${module.slug}`} className="link">Страница в магазине</a>
            </div>
        </div>
        <div className="slug__form">
            {module.default_options?.fields.map((field) => {
                const index = Array.isArray(options[field.slug]) ? options[field.slug].length : 0
                return slugField(field, options[field.slug], onOptionsChange, handleAdd, options, index, addForm, module.id)
            })}
        </div>
        <div className="slug__end">
            <button onClick={save} className="btn">Сохранить</button>
        </div>
        <Form ref={moduleOptionsForm} method="post">
            <input type="hidden" name={'_action'} value={'save'}/>
            <input type="hidden" name={'id'} value={module.id}/>
            <input type="hidden" name={'options'} value={JSON.stringify(options)}/>
        </Form>
        <Form ref={moduleActivationForm} method="post">
            <input type="hidden" name={'_action'} value={module.buyed ? module.isActive ? 'deactivate' : 'activate' : 'buy'}/>
            <input type="hidden" name={'id'} value={module.id}/>
        </Form>
    </LibraryLayout>
};

export default ModulePage;