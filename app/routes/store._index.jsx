import React, {useEffect, useState} from 'react';
import globalStyles from "~/styles/global.css";
import styles from "~/styles/pages/store.css";
import {requireUser} from "~/utils/session.server";
import {getSession} from "~/sessions";
import {getShops} from "~/models/shop.server";
import {json} from "@remix-run/node";
import Layout from "~/components/Layout/Layout";
import storeIcon from "~/assets/icons/black_store.svg";
import Slider from "react-slick";
import slickStyles from 'slick-carousel/slick/slick.css';
import slickThemeStyles from 'slick-carousel/slick/slick-theme.css';
import Drawing from "~/components/store/Drawing";
import DrawingImg from '~/assets/img/drawings/1.png'
import {buyModule, getModules} from "~/models/module.server";
import Modules from "~/components/Modules";
import {useActionData, useLoaderData} from "@remix-run/react";
import {toast} from "react-toastify";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
        { rel: "stylesheet", href: slickStyles },
        { rel: "stylesheet", href: slickThemeStyles },
    ];
}

export const action = async ({ request }) => {
    const formData = await request.formData();
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session
    const id = formData.get('id')

    return await buyModule(domain, id);
};

export const loader = async ({ request }) => {
    const user = await requireUser(request)
    const { data: session } = await getSession(request.headers.get("Cookie"))

    const { domain } = session
    let modules = []
    const noties = []
    let shops = await getShops(domain, user.id);
    shops = shops.data.shops

    if(domain) {
        modules = await getModules(domain)
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
        modules,
        noties,
    });
};

const Store_index = () => {
    const loaderData = useLoaderData()
    const [modules, setModules] = useState([])
    const [search, setSearch] = useState('')
    const actionData = useActionData();

    useEffect(() => {
        setModules(loaderData.modules.map(module => {
            module.title_ = false
            module.hidden = false

            return module
        }))
    }, [])

    useEffect(() => {
        let query = search.trim().toLowerCase();

        const setModulesDefault = () => {
            setModules(loaderData.modules.map(module => {
                module.title_ = false
                module.hidden = false

                return module
            }))
        }

        try {
            if (query !== '') {
                setModules(modules.map((module) => {
                    let pos = module.title.toLowerCase().search(query);

                    if (pos !== -1) {
                        let len = query.length;

                        module.title_ = {
                            start: module.title.slice(0,pos),
                            mark: module.title.slice(pos, pos+len),
                            end: module.title.slice(pos+len)
                        }

                        module.hidden = false
                    } else {
                        module.title_ = false

                        module.hidden = true
                    }

                    return module
                }));
            } else {
                setModulesDefault()
            }
        } catch (e) {
            setModulesDefault()
        }
    }, [search])

    const settings = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 3,
        autoplay: true,
        variableWidth: true,
    };

    const drawings = [
        {
            img: DrawingImg
        },
        {
            img: DrawingImg
        },
        {
            img: DrawingImg
        },
        {
            img: DrawingImg
        },
    ]

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.buyModule && toast('Покупка модуля завершена успешно')
        }
    }, [actionData])

    return (
        <Layout>
            <div className="title">
                <div className="title__left">
                    <img src={storeIcon}/>
                    Магазин
                </div>
                <div className="title__right">
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="store-search" placeholder={'Поиск...'}/>
                </div>
            </div>
            <Slider {...settings}>
                {drawings.map((drawing, i) => <Drawing key={'drawing-'+i} drawing={drawing} />)}
            </Slider>
            <Modules modules={modules} />
        </Layout>
    );
};

export default Store_index;