import React, { useState } from 'react'
import Thumbnail from './Thumbnail'
import styles from './styles.module.scss'

export default function Thumbnails(props) {

    // const [dragging, setDragging] = useState(false)

    // function draggingOver(e) {
    //     e.preventDefault()
    //     setDragging(true)
    //     console.log('dragging Over!!')
    // }
    // function draggingLeave(e) {
    //     e.preventDefault()
    //     setDragging(false)
    //     console.log('dragging Leave!!')
    // }

    // function draggingEnter(e) {
    //     e.preventDefault()
    // }


    // function dropFiles(ev) {
    //     ev.preventDefault()
    //     const files = [];
    //     let formData = new FormData()

    //     if (ev.dataTransfer.items) {
    //         // Use DataTransferItemList interface to access the file(s)
    //         for (let i = 0; i < ev.dataTransfer.items.length; i++) {
    //             // If dropped items aren't files, reject them
    //             if (ev.dataTransfer.items[i].kind === 'file') {
    //                 const file = ev.dataTransfer.items[i].getAsFile();
    //                 files.push(file)
    //                 formData.append('images', file, file.name)
    //             }
    //         }
    //     } else {
    //         // Use DataTransfer interface to access the file(s)
    //         for (let i = 0; i < ev.dataTransfer.files.length; i++) {
    //             files.push(ev.dataTransfer.files[i])
    //             formData.append('images', files[i], files[i].name)
    //         }
    //     }
    //     axios.post('/api/upload', formData, { params: { filePath: encodeURI(currentDir) } })
    //         .then((res) => {
    //             setLoading(true)
    //             setDragging(false)
    //         })
    //         .catch(err => console.log("Upload Error", err))

    // }

    return (
        props.files.map(file =>{
            return <Thumbnail key={file.name} file={file} deleteFile={props.deleteFile} downloadFile={props.downloadFile} openFolder={props.openFolder}/>
        })
    )
}
