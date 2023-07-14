import React from 'react';
import globalStyles from "~/styles/global.css";
import storeStyles from "~/styles/pages/store.css";
import styles from "~/styles/pages/library.css";
import {requireUser} from "~/utils/session.server";
import {getSession} from "~/sessions";
import {getShops} from "~/models/shop.server";
import {json} from "@remix-run/node";
import libraryIcon from "~/assets/img/library.svg";
import slickStyles from 'slick-carousel/slick/slick.css';
import slickThemeStyles from 'slick-carousel/slick/slick-theme.css';
import {activateModule, deactivateModule, getModules} from "~/models/module.server";
import LibraryLayout from "~/components/Layout/LibraryLayout";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: storeStyles },
        { rel: "stylesheet", href: styles },
        { rel: "stylesheet", href: slickStyles },
        { rel: "stylesheet", href: slickThemeStyles },
    ];
}

export const action = async ({ request, params }) => {
    const formData = await request.formData();
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session

    const action_ = {
        activate: activateModule,
        deactivate: deactivateModule,
    }

    const id = formData.get('id')

    return await action_[formData.get('_action')](domain, id);
};

export const loader = async ({ request, params }) => {
    const user = await requireUser(request)
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session
    const noties = []
    let modules = []
    let shops = await getShops(domain, user.id);
    console.log(shops)
    shops = shops.data.shops

    if(domain) {
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
        modules,
        noties,
    });
};

const Library_index = () => {
    return <LibraryLayout all>
        <div className="library__center">
            <img src={libraryIcon}/>
            <p>Выберите модуль в левом меню,<br/> чтобы его настроить.</p>
        </div>
    </LibraryLayout>
};

export default Library_index;