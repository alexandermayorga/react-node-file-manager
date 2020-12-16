import React from 'react'
import { Link } from 'react-router-dom'
import GlyphIcon from './ui/GlyphIcon'

import { v4 as uuidv4 } from 'uuid';

export default function Sidebar({active}) {

    const links = [
        {
            text: 'My Drive',
            glyphIcon: 'cloud',
            to: '/drive/my-drive'
        },
        {
            text: 'Shared with me',
            glyphIcon: 'share',
            to: '/drive/shared'
        },
        {
            text: 'Starred',
            glyphIcon: 'star-empty',
            to: '/drive/starred'
        },
    ]

    return (
        <ul className="nav nav-sidebar">
            {links.map(link => (
                <li key={uuidv4()}>
                    <Link to={link.to}>
                        <GlyphIcon icon={link.glyphIcon}/> {link.text} <span className="sr-only">(current)</span>
                    </Link>
                </li>
            ))}
        </ul>
    )
}
