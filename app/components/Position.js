import React, {useEffect, useRef, useState} from 'react';
import positionImg from '../assets/img/position.png'
import deleteIcon from '../assets/icons/delete.svg'
import plusIcon from '../assets/icons/add.svg'
import {Dialog, Heading, Label, Pane, SideSheet, Textarea, TextInputField, Tooltip} from "evergreen-ui";
import {Form, Link, useActionData, useLoaderData, useLocation, useSearchParams, useSubmit} from "@remix-run/react";
import {$positionTypes} from "~/config";
import {store} from "~/lib/mobx";
import {observer} from "mobx-react";
import ImageInput from "~/components/ImageInput";
import categoryDefaultImg from '~/assets/img/category.png'
import {$routes} from "~/utils/config";
import Row from "~/components/Row";
import Select, {components} from "react-select";
import makeAnimated from 'react-select/animated';


const MultiValueLabel = (props) => {
    const image = props.data.Media[0]

    return (
        <components.MultiValueLabel {...props}>
            <div className={'filter-tag'}>
                {image ? <img src={`https://www.inshop-online.com/storage/${props.data.uuid}/images/${image.filename}`} alt={props.data.title}/> : null}
                <span>{props.data.title}</span>
            </div>
        </components.MultiValueLabel>
    );
};

const animatedComponents = makeAnimated({MultiValueLabel});


const Position = ({ position, categories, currency }) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const data = useLoaderData();
    const discount_types = {
        PERCENT: '%',
        AMOUNT: currency,
    }

    const submit = useSubmit();
    const actionData = useActionData();
    const deleteFor = useRef();
    const location = useLocation();

    const [selected, setSelected] = useState(store.hasSelectedItem(position.id, location.pathname))
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isPropCreateShown, setIsPropCreateShown] = useState(false)
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const [title, setTitle] = useState(position.title);
    const [type, setType] = useState('');
    const [subtitle, setSubtitle] = useState(position.subtitle);
    const [description, setDescription] = useState(position.description);
    const [price, setPrice] = useState(position.price);
    const [inStock, setInStock] = useState(position.inStock);
    const [categoryId, setCategoryId] = useState(position.Category?.Id);
    const [priority, setPriority] = useState(position.priority);
    const [discount, setDiscount] = useState(position.discount);
    const [discountType, setDiscountType] = useState(position.discountType);
    const [properties, setProperties] = useState(position.properties);
    // const [tags, setTags] = useState(position.Tags.map(tag => {
    //     tag.value = tag.id
    //     tag.label = tag.title
    //
    //     return tag
    // }));
    console.log(position)
    const thumb = position.Media && position.Media.length && position.Media.find(media => media.name === 'thumb') ? [
        position.Media.find(media => media.name === 'thumb').filename
    ] : []
    const images = position.Media && position.Media.length && position.Media.find(media => media.name === 'image') ?
        position.Media.filter(media => media.name === 'image').map(image => image.filename) : []

    const categoryImage = position.Category && position.Category.Media && position.Category.Media.length && position.Category.Media.find(media => media.name === 'image') ? [
        position.Category.Media.find(media => media.name === 'image').filename
    ] : []

    const [newPropKey, setNewPropKey] = useState('');

    // const tagsOptions = data.shop.Tags.map(tag => {
    //     tag.value = tag.id
    //     tag.label = tag.title
    //
    //     return tag
    // })

    useEffect(() => {
        setSelected(store.hasSelectedItem(position.id, location.pathname))
    }, [store.selectedItems.length])

    const handleSelect = checked => {
        setSelected(checked)

        if(selected) {
            store.unselectItem(position.id, location.pathname)
        } else {
            store.selectItem(position.id, location.pathname)
        }
    }

    const handleEdit = () => {
        setIsEditOpen(true)
    }

    const handlePreDelete = () => {
        setIsSureDeleteShown(true)
    }

    const handleDelete = () => {
        setIsSureDeleteShown(false)
        submit(deleteFor.current, { replace: true });
    }

    const handlePropUpdate = (key, value) => {
        const newProperties = JSON.parse(JSON.stringify(properties))

        newProperties[key.toString()] = value

        setProperties(newProperties)
    }

    const handlePropDelete = key => {
        const newProperties = JSON.parse(JSON.stringify(properties))
        delete newProperties[key.toString()]
        setProperties(JSON.parse(JSON.stringify(newProperties)))
    }
    const handlePropCreate = () => {
        const key = newPropKey.toString().trim()

        if(key !== "") {
            const newProperties = JSON.parse(JSON.stringify(properties))

            newProperties[key] = ""

            setProperties(newProperties)

            setIsPropCreateShown(false)
        }
    }

    const handlePrePropCreate = () => {
        setIsPropCreateShown(true)
        setNewPropKey('')
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.updatePosition && setIsEditOpen(false)
            actionData.data.deletePositions && setIsSureDeleteShown(false)
        }
    }, [actionData])

    const getThumbPath = (uuid=position.uuid, image = thumb) => {
        return image.length ? `https://www.inshop-online.com/storage/${uuid}/images/${image[0]}` : positionImg
    }

    const getCategoryThumb = () => {
        return categoryImage.length ? `https://www.inshop-online.com/storage/${position.Category?.uuid}/images/${categoryImage[0]}` : categoryDefaultImg
    }

    const columns = [
        {
            width: 2,
            img: getThumbPath(),
        },
        {
            width: 4,
            content: position.title
        },
        {
            width: 3,
            content: position.subtitle
        },
        {
            width: 3,
            content: <Tooltip content={<div className={'row__tooltip-thumb'} style={{backgroundImage: 'url('+getCategoryThumb()+')'}}></div>} appearance="card">
                <Link to={$routes.storage.categories + '#' + position.Category?.id} className={'link'}>
                    {position.Category?.title}
                </Link>
            </Tooltip>
        },
        {
            width: 3,
            content: position.subtitle
        },
        {
            width: 1,
            number: true,
            price: true,
            content: <>
                <span>{position.price}{data.shop.options.currency}</span>
                {position.discount ? <span className={'row__discount'}>-{position.discount}{discount_types[position.discount_type]}</span> : null}
            </>
        },
        {
            width: 1,
            number: true,
            content: position.inStock
        },
        {
            width: 1,
            number: true,
            content: position.priority
        },
    ]

    return (
        <Row
            handleEdit={handleEdit}
            handlePreDelete={handlePreDelete}
            columns={columns}
            handleCheck={handleSelect}
            checked={selected}
            id={position.id}
            highlighted={searchParams.get('id') === position.id}
            extend={<>
                <SideSheet
                    width={500}
                    isShown={isEditOpen}
                    onCloseComplete={() => setIsEditOpen(false)}
                    shouldCloseOnOverlayClick={false}
                >
                    <Pane padding={16} borderBottom="muted">
                        <Heading size={600}>Редактирование <b>#{position.id}</b></Heading>
                    </Pane>
                    <Form method='post' encType={'multipart/form-data'} className="form">
                        <input type="hidden" name={'_action'} value={'update'}/>
                        <input type="hidden" name={'id'} value={position.id}/>
                        <Label marginBottom={4} display="block">
                            Превью
                        </Label>
                        <ImageInput
                            uuid={position.uuid}
                            images={thumb}
                        />
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
                            name={'subtitle'}
                            label="Подзаголовок"
                            placeholder="Подзаголовок..."
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                        />
                        <Label marginBottom={4} display="block">
                            Описание
                        </Label>
                        <Textarea
                            className={'field'}
                            name={'description'}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание..."
                        />
                        <div className="form__row">
                            <div className="form__col">
                                <TextInputField
                                    className={'field'}
                                    type={'number'}
                                    name={'price'}
                                    label="Цена"
                                    placeholder="Цена..."
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="form__col">
                                <TextInputField
                                    className={'field'}
                                    type={'number'}
                                    name={'inStock'}
                                    label="В наличии"
                                    placeholder="В наличии..."
                                    value={inStock}
                                    onChange={(e) => setInStock(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form__row">
                            <div className="form__col">
                                <Label marginBottom={8} display="block">
                                    Категория
                                </Label>
                                <select
                                    className={'field'}
                                    name={'CategoryId'}
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    {categories.map(cat => <option key={'cat-'+cat.id} value={cat.id}>{cat.title}</option>)}
                                </select>
                            </div>
                            <div className="form__col">
                                <TextInputField
                                    className={'field'}
                                    type={'number'}
                                    name={'priority'}
                                    label="Приоритет"
                                    placeholder="Приоритет..."
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                />
                            </div>
                        </div>

                        {/*<div style={{marginBottom: 15,}}>*/}
                        {/*    <Label marginBottom={8} display="block">*/}
                        {/*        Теги*/}
                        {/*    </Label>*/}
                        {/*    <Select*/}
                        {/*        closeMenuOnSelect={false}*/}
                        {/*        components={animatedComponents}*/}
                        {/*        value={tags}*/}
                        {/*        isMulti*/}
                        {/*        options={tagsOptions}*/}
                        {/*        name={'tags'}*/}
                        {/*        onChange={setTags}*/}
                        {/*        styles={{*/}
                        {/*            control: (baseStyles, state) => ({*/}
                        {/*                fontSize: 16,*/}
                        {/*                borderRadius: 15,*/}
                        {/*                padding: '3px 15px',*/}
                        {/*                display: 'flex',*/}
                        {/*                outline: 'none',*/}
                        {/*                border: '1px solid #d8dae5',*/}
                        {/*                width: '100%',*/}
                        {/*            }),*/}
                        {/*            multiValueLabel: (base, item) => ({*/}
                        {/*                ...base,*/}
                        {/*                backgroundColor: item.data.color,*/}
                        {/*                color: 'white',*/}
                        {/*            }),*/}
                        {/*            menu: (baseStyles, state) => ({*/}
                        {/*                ...baseStyles,*/}
                        {/*                borderRadius: 9*/}
                        {/*            }),*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className="form__row">
                            <div className="form__col">
                                <TextInputField
                                    name={'discount'}
                                    className={'field'}
                                    type={'number'}
                                    label="Скидка"
                                    placeholder="Скидка..."
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                            </div>
                            <div className="form__col">
                                <Label marginBottom={8} display="block">
                                    Тип скидки
                                </Label>
                                <select
                                    name={'discount_type'}
                                    className={'field'}
                                    value={discountType}
                                    onChange={(e) => setDiscountType(e.target.value)}
                                >
                                    <option value="PERCENT">Процент</option>
                                    <option value="AMOUNT">Сумма</option>
                                </select>
                            </div>
                        </div>
                        <Label marginBottom={8} display="block">
                            Тип позиции
                        </Label>
                        <select
                            className={'field ub-mb_24px'}
                            name={'type'}
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {$positionTypes.map((type, i) => <option key={'type-'+i} value={type.slug}>{type.title}</option>)}
                        </select>
                        <div className="form__header">
                            <Label display="block">
                                Свойства
                            </Label>
                            <button type={'button'} onClick={handlePrePropCreate} className="btn btn_sm btn_lime">
                                <img src={plusIcon} />
                            </button>
                        </div>



                        <Dialog
                            isShown={isPropCreateShown}
                            title="Новое свойство"
                            onCloseComplete={() => setIsPropCreateShown(false)}
                            confirmLabel="Создать"
                            cancelLabel="Отмена"
                            onConfirm={handlePropCreate}
                        >
                            <input
                                className={'field'}
                                placeholder="Название..."
                                value={newPropKey}
                                onChange={(e) => setNewPropKey(e.target.value)}
                            />
                        </Dialog>

                        {properties && Object.entries(properties).map((property, i) => {
                            return (
                                <div key={'property-' + i} className="property">
                                    <div className="property__col">
                                        <input
                                            name={`properties_keys`}
                                            value={property[0]}
                                            className={'field'}
                                            placeholder="Название..."
                                            readOnly
                                        />
                                    </div>
                                    <div className="property__col">
                                        <input
                                            name={`properties_values`}
                                            value={property[1]}
                                            onChange={(e) => handlePropUpdate(property[0], e.target.value)}
                                            className={'field'}
                                            placeholder="Значение..."
                                        />
                                    </div>
                                    <button className="btn btn_sm btn_red property__btn" onClick={() => handlePropDelete(property[0])}>
                                        <img src={deleteIcon}/>
                                    </button>
                                </div>
                            )
                        })}

                        <Label marginBottom={4} marginTop={4} display="block">
                            Картинки
                        </Label>
                        <ImageInput
                            uuid={position.uuid}
                            images={images}
                            multiple
                        />

                        <div className="d-flex flex-end mt-1">
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
                    Позиция будет удалена безвозвратно
                    <Form ref={deleteFor} method="post">
                        <input type="hidden" name={'_action'} value={'delete'}/>
                        <input type="hidden" name={'id'} value={position.id}/>
                    </Form>
                </Dialog>
            </>}
        />
    );
};

export default observer(Position);