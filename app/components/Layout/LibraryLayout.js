import React, {useEffect, useState} from 'react';
import libraryIcon from "~/assets/icons/black_library.svg";
import Modules from "~/components/Modules";
import Layout from "~/components/Layout/Layout";
import {useActionData, useLoaderData} from "@remix-run/react";
import {toast} from "react-toastify";

function LibraryWrapper({ children, modules, search, setSearch }) {
    return <>
        <div className="title">
            <div className="title__left">
                <img src={libraryIcon}/>
                Библиотка
            </div>
            <div className="title__right">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="store-search" placeholder={'Поиск...'}/>
            </div>
        </div>
        <div className="library">
            <div className="library__left">
                <Modules forLibrary modules={modules} />
            </div>
            <div className="library__right">
                {children}
            </div>
        </div>
    </>;
}

const LibraryLayout = ({ children, all=false }) => {
    const loaderData = useLoaderData()
    const actionData = useActionData();
    const [search, setSearch] = useState('')
    const [modules, setModules] = useState([])

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
                module.buyed = true

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

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.activateModule && toast('Модуль был активирован')
            actionData.data.deactivateModule && toast('Модуль был деактивирован')
        }
    }, [actionData])

    const wrapper = (children) => <LibraryWrapper modules={modules} search={search} setSearch={setSearch} children={children} />

    return all ? <Layout>
        {wrapper(children)}
    </Layout> : <Layout render={(motion) => wrapper(motion)}>
        {children}
    </Layout>;
};

export default LibraryLayout;