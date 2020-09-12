import React from 'react'
import BreadcrumbsLink from './BreadcrumbsLink';
import { useHistory } from "react-router-dom";
import './style.css'

export default function Breadcrumbs({filePath}) {
    let history = useHistory();

    const home = (
        <li key="my-drive" onClick={() => history.push(`/drive/my-drive`)}>
            <span className="glyphicon glyphicon-hdd" aria-hidden="true" style={{ marginRight: "5px" }}></span> <span>My Drive</span>
        </li>
    )

    return (
        <ol className="breadcrumb">
            {
                filePath.map((folder,i, arr) => {
                    if (folder.id === "my-drive") return home;
                    
                    const newFolder = { ...folder }

                    newFolder['active'] = (i === arr.length - 1) ? true : false;

                    return <BreadcrumbsLink 
                            key={newFolder.id} 
                            folder={newFolder} 
                            onClickHandler={folderID => history.push(`/drive/${folderID}`)} 
                            />
                })
            }
            
        </ol>
    )
}
