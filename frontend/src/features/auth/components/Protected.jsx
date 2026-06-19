import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return (
            <main className='loading-screen'>
                <div className='loader-container'>
                    <div className='character'>
                        <div className='character__head'>
                            <div className='character__eyes'>
                                <div className='character__eye'></div>
                                <div className='character__eye'></div>
                            </div>
                            <div className='character__mouth'></div>
                        </div>
                        <div className='character__body'></div>
                        <div className='character__arms'>
                            <div className='character__arm'></div>
                            <div className='character__arm'></div>
                        </div>
                    </div>
                    <div className='loading-bar-container'></div>
                    <p className='loading-text'>Loading</p>
                </div>
            </main>
        )
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected