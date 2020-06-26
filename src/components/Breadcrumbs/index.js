import React from 'react'
import BreadcrumbsLink from './BreadcrumbsLink';
import './style.css'

export default function Breadcrumbs({ path, goToFolder}) {

    const paths = path.split('/').filter(p => p !== "");
    
    const dir = paths.map((p, i) => {

        const name = paths[i];
        const pathName = `/${paths.slice(0, i + 1).join('/')}/`;
    
        return {name,pathName};
    })

    function clickHandlerHome(){
        goToFolder('/')
    }

    return (
        <ol className="breadcrumb">
            <li onClick={clickHandlerHome}>
                <span className="glyphicon glyphicon-hdd" aria-hidden="true" style={{ marginRight: "5px" }}></span> <span>Home</span>
            </li>
            {
                dir.length > 0
                &&
                dir.map((folder,i) => {
                    if (i === dir.length - 1) folder['active'] = true;
                    return <BreadcrumbsLink key={folder.name} folder={folder} goToFolder={goToFolder} />
                })
            }
            
        </ol>
    )
}
