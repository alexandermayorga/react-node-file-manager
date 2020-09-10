import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from "axios";

import Routes from './Routes';

export default function App() {
    const [auth, setAuth] = useState({
        loggedIn: false,
        checking: true
    })
    const [user, setUser] = useState()
    let location = useLocation();

    useEffect(() => {
        let cancel
        axios.post('/api/authenticate', {
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                // console.log("Authenticated Request!")
                setUser(res.data)
                setAuth({
                    loggedIn: true,
                    checking: false
                })
            })
            .catch(err => {
                // console.log("There was an error Authenticating")
                console.log(err)
                setAuth({
                    loggedIn: false,
                    checking: false
                })
            })
        //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
        return () => cancel(); 

    }, [])

    useEffect(() => {
        let cancel
        axios.post('/api/authenticate', {
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                console.log("Authenticated Request!")
            })
            .catch(err => {
                console.log("There was an error Authenticating")
                console.log(err)
                setAuth({
                    loggedIn: false,
                    checking: false
                })
            })
        //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
        return () => cancel(); 

    }, [location])

    return (
        <Routes auth={auth} user={user}/>
    )
}
