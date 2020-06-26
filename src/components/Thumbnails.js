import React from 'react'
import Thumbnail from './Thumbnail/'

export default function Thumbnails({ files, deleteFile, downloadFile, openFolder}) {
    return (
        files.map(file =>{
            return <Thumbnail key={file.fileName} file={file} deleteFile={deleteFile} downloadFile={downloadFile} openFolder={openFolder}/>
        })
    )
}
