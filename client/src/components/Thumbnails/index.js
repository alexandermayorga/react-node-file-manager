import React from 'react'
import Thumbnail from '../Thumbnail'
import styles from './styles.module.scss'

export default function Thumbnails(props) {



    return (
        <div
            onDrop={props.onDrop}
            onDragEnter={props.onDragEnter} 
            onDragLeave={props.onDragLeave}
            onDragOver={props.onDragOver} 
            className={`${styles.Thumbnails} clearfix`}
        >
        {
            props.dragging
            &&
            <div className="col-sm-12">
                <div className="well">
                        <div>Drop Files Here...</div>
                </div>
            </div>
        }
        {
            !props.dragging
            &&
            props.files.map(file =>{
                return <Thumbnail key={file.fileName} file={file} deleteFile={props.deleteFile} downloadFile={props.downloadFile} openFolder={props.openFolder}/>
            })
        }
        </div>
    )
}
