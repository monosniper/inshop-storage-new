import React, {useRef} from 'react';
import moduleImg from "~/assets/img/module.png";
import {Form, Link, useParams, useSubmit} from "@remix-run/react";
import {$routes} from "~/utils/config";
import {Position, Tooltip} from "evergreen-ui";
import dependenciesIcon from '~/assets/icons/dependencies.svg'
import checkCircleIcon from '~/assets/icons/check_circle.svg'
import Switch from "~/components/ui/Switch";

const Module = ({ module, forLibrary=false }) => {
    const submit = useSubmit();
    const moduleBuyForm = useRef();
    const { slug } = useParams()
    const moduleActivationForm = useRef();
    const image = module.Media?.length && module.Media.find(media => media.name === 'image') ? [
        module.Media.find(media => media.name === 'image').filename
    ] : []

    const getImagePath = () => {
        return image.length ? `https://www.inshop-online.com/storage/modules/${module.uuid}/image/${image[0]}` : moduleImg
    }

    const handleClick = () => {
        submit(moduleBuyForm.current, { replace: true });
    }

    const handleActivate = (checked) => {
        submit(moduleActivationForm.current, { replace: true });
    }

    return (
        <div className={'module ' + (forLibrary ? module.slug === slug ? 'active' : '' : '')}>
            <div className="module__left">
                <div className="module__img" style={{backgroundImage: `url('${getImagePath()}')`}}></div>
            </div>
            <div className="module__right">
                <Link className={'module__title'} to={forLibrary ? $routes.library.module(module.slug) : $routes.store.module(module.slug)}>
                    <Tooltip content={module.title} position={Position.TOP} showDelay={module.title.length > 20 ? 0 : 99999}>
                        <div>
                            {module.title_ ? module.title_.start : module.title.slice(0, 20) + (module.title.length > 20 ? '...' : '')}
                            {module.title_ && <mark>{module.title_.mark}</mark>}
                            {module.title_ && module.title_.end}
                        </div>
                    </Tooltip>
                </Link>
                <div className="module__body">{module.description}</div>
                <div className="module__footer">
                    <div className="module__terms">
                        {module.Dependencies.length ? <Tooltip content={'Имеет зависимости'} position={Position.BOTTOM}>
                            {module.Dependencies.length ? <img src={dependenciesIcon} /> : null}
                        </Tooltip> : null}
                    </div>
                    {forLibrary ? (
                        <>
                            <Switch onChange={handleActivate} defaultChecked={module.isActive} />
                            <Form style={{display: 'none'}} ref={moduleActivationForm} method="post">
                                <input type="hidden" name={'_action'} value={module.isActive ? 'deactivate' : 'activate'}/>
                                <input type="hidden" name={'id'} value={module.id}/>
                            </Form>
                        </>) : <button onClick={handleClick} className={"module-btn " + (module.buyed ? 'module-btn_buyed' : '')}>
                        {module.buyed ? <img src={checkCircleIcon}/> : '$' + module.price / 100}
                        <span className="module-btn__text">{module.buyed ? 'Куплено' : 'Купить'}</span>
                    </button>}
                </div>
            </div>
            {module.buyed ? null : <Form ref={moduleBuyForm} method="post">
                <input type="hidden" name={'_action'} value='buy'/>
                <input type="hidden" name={'id'} value={module.id}/>
            </Form>}
        </div>
    );
};

export default Module;