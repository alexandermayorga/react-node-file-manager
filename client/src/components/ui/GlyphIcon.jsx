import React from 'react'

export default function GlyphIcon({icon}) {
    return (
        <span className={`glyphicon glyphicon-${icon}`} aria-hidden="true"></span>
    )
}
