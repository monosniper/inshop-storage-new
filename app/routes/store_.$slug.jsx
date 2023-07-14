import React, {useEffect, useRef} from 'react';
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
import {getModule, activateModule, deactivateModule, buyModule} from "~/models/module.server";
import Modules from "~/components/Modules";
import {Form, useActionData, useLoaderData, useSubmit} from "@remix-run/react";
import payedIcon from '~/assets/icons/payed.svg'
import dependenciesIcon from '~/assets/icons/dependencies.svg'
import moduleImg from "~/assets/img/module.png";
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
    const action_ = {
        activate: activateModule,
        deactivate: deactivateModule,
        buy: buyModule,
    }
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session

    const id = formData.get('id')

    return await action_[formData.get('_action')](domain, id);
};

export const loader = async ({ request, params }) => {
    const user = await requireUser(request)
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session
    let module
    const noties = []
    let shops = await getShops(domain, user.id);
    console.log(shops)
    shops = shops.data.shops

    if(domain) {
        module = await getModule(domain, params.slug)
        module = module.data.module
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
        noties,
    });
};

const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
};

function ModulePageSlider({ images, getImagePath }) {
    return images.length ? <div className="module-page__slider">
        <Slider {...settings}>
            {images.map((image, i) => <img key={'img-'+i} src={getImagePath(image)} />)}
        </Slider>
    </div> : null;
}

const ModulePage = () => {
    const loaderData = useLoaderData()
    const actionData = useActionData()
    const module = loaderData.module
    const submit = useSubmit();
    const moduleActivationForm = useRef();

    const image = module.Media?.length && module.Media.find(media => media.name === 'image') ? [
        module.Media.find(media => media.name === 'image').filename
    ] : []
    const images = module.Media?.length && module.Media.find(media => media.name === 'images') ?
        module.Media.filter(media => media.name === 'images').map(image => image.filename) : []

    const getImagePath = (filename=image[0], s=false) => {
        return image.length ? `https://www.inshop-online.com/storage/modules/${module.uuid}/image${s?'s':''}/${filename}` : moduleImg
    }

    const getImagesPath = (filename) => {
        return `https://www.inshop-online.com/storage/modules/${module.uuid}/images/${filename}`
    }

    const handleClick = () => {
        submit(moduleActivationForm.current, { replace: true });
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.activateModule && toast('Модуль был активирован')
            actionData.data.deactivateModule && toast('Модуль был деактивирован')
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
            </div>

            <div className="module-page__header">
                <div className="module-page-details">
                    <div className="module-page__img" style={{backgroundImage: `url('${getImagePath()}')`}}></div>
                    <div className="module-page-details__right">
                        <div className="module-page__title">{module.title}</div>
                        <div className="module-page__terms">
                            <div className="module-page__term">
                                <img src={payedIcon} />
                                {module.price > 0 ? 'Платный' : 'Бесплатный'}
                            </div>
                            <div className="module-page__term">
                                <img src={dependenciesIcon} />
                                {module.Dependencies.length ? 'Имеет зависимости' : 'Без зависимостей'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="module-page__panel">
                    <button onClick={handleClick} className={"module-page__btn " + (module.buyed ? 'module-page__btn_buyed' : '')}>
                        {module.buyed ? module.isActive ? 'Деактивировать' : 'Активировать' : 'Купить'}
                    </button>
                    {module.buyed ? null : <div className="module-page__price">${module.price / 100}</div>}
                </div>
            </div>
            <div className="module-page__body">
                <div className="module-page__left">
                    {module.Dependencies.length ? <ModulePageSlider images={images} getImagePath={getImagesPath}/> : null}
                    <div className="module-page__description">
                        <div className="module-page__title module-page__title_min">Описание</div>
                        <p>{module.description}</p>
                    </div>
                </div>
                <div className="module-page__right">
                    {module.Dependencies.length ? <div className="module-page__dependencies">
                        <div className="module-page__title module-page__title_min">Зависимости</div>
                        <Modules oneCol modules={module.Dependencies}/>
                    </div> : <ModulePageSlider images={images} getImagePath={getImagesPath} />}
                </div>
            </div>
            <Form ref={moduleActivationForm} method="post">
                <input type="hidden" name={'_action'} value={module.buyed ? module.isActive ? 'deactivate' : 'activate' : 'buy'}/>
                <input type="hidden" name={'id'} value={module.id}/>
            </Form>
        </Layout>
    );
};

export default ModulePage;