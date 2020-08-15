import React from 'react'

export default function ButtonGroup(props) {
    return (
        <button type={props.type} name={props.name} className={`btn ${props.modifierClass}`}>
            <span className={`glyphicon ${props.glyphicon}`} aria-hidden="true"></span> {props.children}
        </button>
    )
}
