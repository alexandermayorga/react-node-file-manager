import React from 'react'

export default function BreadcrumbsLink({folder,onClickHandler}) {

    return (
        <li 
        key={folder.id} 
        className={folder.active ? 'active' : null} 
        onClick={() => onClickHandler(folder.id)}>
            <span>{folder.name}</span>
        </li>
    )

}
