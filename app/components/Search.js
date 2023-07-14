import React, {useEffect, useRef, useState} from 'react';
import searchIcon from '~/assets/icons/Search.svg'
import {Link, useFetcher} from "@remix-run/react";

const Search = () => {
    const results = useFetcher();
    const field = useRef()
    const limit = 2
    const trans = {
        positions: 'Позиция',
        modules: 'Модуль',
        categories: 'Категория',
    }
    const [hidden, setHidden] = useState(true)
    const [q, setQ] = useState('')

    const handleOpen = () => {
        field.current.style.width = '350px'
        field.current.style.borderWidth = '1px'
    }

    useEffect(() => {
        if(q === '') setHidden(true)
    }, [q])

    const handleSearch = (e) => {
        setQ(e.target.value.trim())

        if(e.target.value.trim() !== '') {
            results.submit({
                limit,
                q: e.target.value.trim()
            }, {method: 'get', action: '/api/search'});
            setHidden(false)
        }
    }

    useEffect(() => {
        setHidden(results.state === 'submitting')
    }, [results.state])

    return (
        <div className={'search'}>
            <div ref={field} className="search__field">
                <img onClick={handleOpen} src={searchIcon} />
                <input type="hidden" name={'limit'} value={limit} />
                <input
                    autoComplete={'off'}
                    type="search"
                    name={'q'}
                    value={q}
                    // onChange={(e) => e.target.value.trim() !== '' ? handleSearch(e) : setHidden(true)}
                    onChange={handleSearch}
                    placeholder={'Поиск...'}
                />
            </div>
            {results.state === "submitting" ? (
                <div className="search__results">
                    <div className="search__tag">Загрузка...</div>
                </div>
            ) : null}
            {!hidden && results.data ? results.data.error ? (
                <div className="search__results">
                    <div className="search__tag">Произошла ошибка, попробуйте чуть позже.</div>
                </div>
            ) : results.data.length ? (
                <div className="search__results">
                    {results.data.map((result, i) => (
                        <Link style={{textDecoration: 'none'}} key={'result-'+result.type+'-'+i} to={result.link}>
                            <div className="search__result">
                                <div className="search__left">
                                    <div className="search__icon">
                                        <img src={result.icon} />
                                    </div>
                                    <div className="search__title">
                                        {result.title}
                                    </div>
                                </div>
                                <div className="search__type">
                                    {trans[result.type]}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="search__results">
                    <div className="search__tag">Ничего не найдено</div>
                </div>
            ) : null}
        </div>
    );
};

export default Search;