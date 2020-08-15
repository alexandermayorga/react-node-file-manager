import React from 'react'
import Header from "../HeaderFooter/Header";
import classes from './layout.module.css'

export default function Layout(props) {
    return (
        <>
            <Header/>
            <div className={classes.mainColumns}>
                <div className={classes.mainColumns__left}>
                    Sidebar
                </div>
            <div className={classes.mainColumns__right}>
                    {props.children}
                </div>
            </div>
        </>
    )
}
