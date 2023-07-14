import {json} from "@remix-run/node";
import {requireUser} from "../utils/session.server";
import {searchPositions, searchModules, searchCategories} from "../models/shop.server";
import moduleImg from "../assets/img/module.png";
import positionImg from "../assets/img/position.png";
import categoryImg from "../assets/img/category.png";
import {getSession} from "../sessions";

export const loader = async ({ request }) => {
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session
    console.log(domain)
    const url = new URL(request.url);
    console.log(url.searchParams)
    const query = url.searchParams.get("q").trim();
    const limit = url.searchParams.get("limit");

    const user = await requireUser(request)
    let positions = await searchPositions(domain, query, Number(limit))
    let modules = await searchModules(domain, query, Number(limit))
    let categories = await searchCategories(domain, query, Number(limit), user.id)
    // let shops = await searchShops(domain, query, Number(limit), user.id)

    const data = {
        positions: positions.data.positions.map(pos => {
            const image = pos.Media?.length && pos.Media.find(media => media.name === 'thumb') ? [
                pos.Media.find(media => media.name === 'thumb').filename
            ] : []

            return {...pos,
                type: 'positions',
                link: '/storage?id='+pos.id,
                icon: image.length ? `https://www.inshop-online.com/storage/${pos.uuid}/images/${image[0]}` : positionImg
            }
        }),
        modules: modules.data.modules.map(mod => {
            const image = mod.Media?.length && mod.Media.find(media => media.name === 'image') ? [
                mod.Media.find(media => media.name === 'image').filename
            ] : []

            return {...mod,
                type: 'modules',
                link: '/store/'+mod.slug,
                icon: image.length ? `https://www.inshop-online.com/storage/modules/${mod.uuid}/image/${image[0]}` : moduleImg
            }
        }),
        categories: categories.data.categories.map(cat => {
            const image = cat.Media?.length && cat.Media.find(media => media.name === 'image') ? [
                cat.Media.find(media => media.name === 'image').filename
            ] : []

            return {...cat,
                type: 'categories',
                link: '/storage/categories?id='+cat.id,
                icon: image.length ? `https://www.inshop-online.com/storage/${cat.uuid}/images/${image[0]}` : categoryImg
            }
        }),
        // shops: shops.data.shops.map(shop => {
        //     const image = shop.Media?.length && shop.Media.find(media => media.name === 'preview') ? [
        //         shop.Media.find(media => media.name === 'preview').filename
        //     ] : []
        //
        //     return {...shop,
        //         type: 'shops',
        //         icon: image.length ? `https://www.inshop-online.com/storage/${shop.uuid}/images/${image[0]}` : shopImg
        //     }
        // })
    }

    const results = [
        ...data.positions,
        ...data.modules,
        ...data.categories,
        // ...data.shops
    ]

    return json(results);
};

export default <></>