import React from 'react'
import styles from "./loader.module.css";

export default function Loader() {
    const classes = ["glyphicon glyphicon-refresh", styles.spin]

    return (
        <span className={classes.join(' ')} aria-hidden="true"></span>
    )
}
