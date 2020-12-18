import React, {useEffect,useState} from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import GlyphIcon from './ui/GlyphIcon'

import { v4 as uuidv4 } from 'uuid';

export default function Sidebar() {
    let location = useLocation();
    let {folderID} = useParams();
    const [activeLink, setActiveLink] = useState()

    useEffect(() => {
        if(folderID) return setActiveLink('/my-drive');

        let pathname = location.pathname.replace('/drive','')

        setActiveLink(pathname);
    }, [location])

    const links = [
        {
            text: 'My Drive',
            glyphIcon: 'cloud',
            to: '/my-drive'
        },
        {
            text: 'Shared with me',
            glyphIcon: 'share',
            to: '/shared'
        },
        {
            text: 'Starred',
            glyphIcon: 'star-empty',
            to: '/starred'
        },
    ]

    return (
        <ul className="nav nav-sidebar">
            {links.map(link => (
                <li key={uuidv4()} className={activeLink === link.to ? 'active' : null}>
                    <Link to={`/drive${link.to}`}>
                        <GlyphIcon icon={link.glyphIcon}/> {link.text} <span className="sr-only">(current)</span>
                    </Link>
                </li>
            ))}
        </ul>
    )
}
