import React from 'react'

export default function BreadcrumbsLink({folder,goToFolder}) {

    function clickHandler() {
        goToFolder(folder.pathName)
    }

    return (
        <li key={folder.name} className={folder.active && 'active'} onClick={clickHandler}><span>{folder.name}</span></li>
    )

}
