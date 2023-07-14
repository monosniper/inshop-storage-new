import React, {useEffect, useRef} from 'react';
import Header from "~/components/Layout/Header";
import Navigation from "~/components/Layout/Navigation";
import {toast, ToastContainer} from "react-toastify";
import {useLoaderData, useLocation, useNavigation} from "@remix-run/react";
import LoadingBar from 'react-top-loading-bar'
import {motion} from 'framer-motion'
import SelectBar from "~/components/SelectBar";

const Layout = ({ children, render=null }) => {
    const loadingRef = useRef()
    const transition = useNavigation()
    const loaderData = useLoaderData()

    useEffect(() => {
        if(transition.state === 'loading') {
            loadingRef.current.continuousStart()
        }
        transition.state === 'idle' && loadingRef.current.complete()

        if(loaderData.noties) {
            toast.dismiss()
            loaderData.noties.forEach(noty => {
                toast(noty.message)
            })
        }
    }, [transition.state])

    const motionEl = <motion.main
        className={'anim'}
        key={useLocation().pathname}
        initial={{x: '10%', opacity: 0}}
        animate={{opacity: 1, x: '0'}}
        exit={{x: '-10%', opacity: 0}}
        transition={{duration: 0.3}}
    >
        {children}
    </motion.main>

    return (
        <div className={'wrapper container'}>
            <Navigation />
            <div className={'wrapper__right'}>
                {loaderData && <Header {...loaderData} />}
                {render ? render(motionEl) : motionEl}
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
            <SelectBar />

            <LoadingBar color='#50139E' ref={loadingRef} />
        </div>
    );
};

export default Layout;