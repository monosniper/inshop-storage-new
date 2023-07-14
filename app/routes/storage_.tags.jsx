import {json} from "@remix-run/node";
import {Form, useActionData, useLoaderData, useLocation} from "@remix-run/react";
import {
    createTag,
    deleteTags,
    deleteTag,
    getTags,
    updateTag
} from "~/models/tag.server";

import styles from "~/styles/global.css";
import Layout from "~/components/Layout/Layout";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Heading, Pane, SideSheet, TextInputField} from "evergreen-ui";
import plusIcon from "~/assets/icons/add.svg";
import {store} from "~/lib/mobx";
import {getSession} from "~/sessions";
import {getShops} from "~/models/shop.server";
import {requireUser} from "~/utils/session.server";
import positionsIcon from '~/assets/icons/nav/storage.svg';
import categoriesIcon from '~/assets/icons/nav/storage/categories.svg';
import tagsIcon from '~/assets/icons/nav/storage/tags.svg';
import tagsIconBlack from '~/assets/icons/nav/storage/tags_black.svg';
import Tags from "~/components/Tags";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader = async ({ request }) => {
    const { data: session } = await getSession(request.headers.get("Cookie"))

    const user = await requireUser(request)
    let tags = []
    const noties = []

    const { domain } = session

    if(domain) {
        tags = await getTags(domain)
        tags = tags.data.tags
    } else {
        noties.push({
            type: 'warning',
            message: 'Необходимо выбрать магазин'
        })
    }

    let shops = await getShops(domain, user.id);
    shops = shops.data.shops

    return json({
        tags,
        shops,
        domain,
        user,
        noties,
        subNav: [
            {
                pathname: '/storage',
                icon: positionsIcon,
                title: 'Позиции',
            },
            {
                pathname: '/storage/categories',
                icon: categoriesIcon,
                title: 'Категории',
            },
            {
                pathname: '/storage/tags',
                icon: tagsIcon,
                title: 'Теги',
            },
        ],
    });
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const { data: session } = await getSession(request.headers.get("Cookie"))
    const { domain } = session

    let result = null;

    switch (formData.get('_action')) {
        case 'update':
            result = await updateTag(domain, {
                filters: { id: formData.get('id') },
                set: {
                    title: formData.get('title'),
                    color: formData.get('color'),
                },
                media: {
                    image: formData.get('image'),
                }
            });
            break;
        case 'create':
            result = await createTag(domain, {
                title: formData.get('title'),
                color: formData.get('color'),
            });
            break;
        case "delete":
            result = await deleteTag(domain, formData.get('id'))
            break;
        case "deleteMany":
            result = await deleteTags(domain, formData.getAll('ids'))
            break;
    }

    return result
};

export default function TagsPage() {
    const data = useLoaderData();
    const actionData = useActionData();
    const location = useLocation();
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const [title, setTitle] = useState('');
    const [color, setColor] = useState('');

    const handleCreate = () => {
        setIsCreateOpen(true)
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            store.clearSelectedItems(location.pathname)

            actionData.data.updateTag && toast('Изменения сохранены')
            actionData.data.deleteTag && toast('тег удалена')
            actionData.data.deleteMany && toast('Теги удалены')

            if(actionData.data.createTag) {
                setIsCreateOpen(false)
                toast('Тег создан успешно')

                setTitle(null)
                setColor(null)
            }
        }
    }, [actionData])

    return <Layout>
        <div className="title">
          <div className="title__left">
              <img src={tagsIconBlack}/>
              Теги
          </div>
            <div className="title__right">
                <button onClick={handleCreate} className="btn btn_create">
                    <img src={plusIcon}/>
                    <span>Добавить тег</span>
                </button>
            </div>
        </div>

        <Tags tags={data.tags} />

        <SideSheet
            width={500}
            isShown={isCreateOpen}
            onCloseComplete={() => setIsCreateOpen(false)}
            shouldCloseOnOverlayClick={false}
        >
            <Pane padding={16} borderBottom="muted">
                <Heading size={600}>Добавить тег</Heading>
            </Pane>
            <Form method='post' encType={'multipart/form-data'} className="form">
                <input type="hidden" name={'_action'} value={'create'}/>
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

                <div className="d-flex flex-end mt-1">
                    <button className="btn" type={'submit'}
                        // disabled={transition.state === "submitting"}
                    >Сохранить</button>
                </div>
            </Form>
        </SideSheet>
    </Layout>;
}