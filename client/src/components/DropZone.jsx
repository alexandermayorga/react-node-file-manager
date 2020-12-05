import React, {useState} from 'react'
import axios from 'axios';
import classes from './DropZone.module.css'
import GlyphIcon from './ui/GlyphIcon'
import Loader from './ui/Loader';

export default function DropZone({userID,setLoading,parentFolderID,filePath,children}) {

    const [draggingOver, setDraggingOver] = useState(false)
    const [uploading, setUploading] = useState(false)

    function handleDragOver(e) {
        e.preventDefault();
    }
    function handleDragEnter(e) {
        e.preventDefault();
        setDraggingOver(true)
    }
    function handleDragLeave(e) {
        e.preventDefault();
        setDraggingOver(false)
    }
    function handleOnDrop(e) {
        e.preventDefault();

        setUploading(true)
        setDraggingOver(false)

        let files = [...e.dataTransfer.files];
        // console.log(files);
        let formData = new FormData()
        formData.append('userID', userID);
        formData.append('parentFolderID', parentFolderID);
        formData.append('filePath', JSON.stringify({filePath}));

        files.map( file => {
            if(file.type !== 'image/jpeg' && file.type !=="image/png") return
            return formData.append('images', file, file.name)
        } )

        // Display the values of formData
        // for (var value of formData.values()) {
        //     console.log(value); 
        // }

        axios.post('/api/upload', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            },
            // onUploadProgress: function(progressEvent) {
            // var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            // console.log(percentCompleted)
            // }
        })
            .then( res => {
                setUploading(false)
                setLoading(true)
            } )
            .catch( err => {
                alert("Upload Error")
                console.log("Upload Error", err)
            })

    }

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleOnDrop}
            onDragOver={handleDragOver}
            className={`clearfix ${(draggingOver || uploading) && classes.dropZone}`}
        >
            {
                showCurrentState(draggingOver,uploading,children)
            }
        </div>
    )
}


function showCurrentState(draggingOver,uploading,children) {
    if (draggingOver) return <DropBox/>
    if (uploading) return <Uploading/>
    return children
}


function DropBox(){
    return (
        <>
            <div className={classes.dropZone__box}></div>
            <div className={classes.dropZone__visualCue}>
                <div className="text-center" style={{fontSize: "12rem", lineHeight:"14rem"}}><GlyphIcon icon="cloud-upload"/></div>
                <div className="text-center"  style={{fontSize: "2rem"}}>Drop Files Here</div>
            </div>
        </>
    )
}

function Uploading(){
    return (
        <>
            <div className={classes.dropZone__box}></div>
            <div className={classes.dropZone__visualCue}>
                <div className="text-center" style={{fontSize: "12rem", lineHeight:"14rem"}}><GlyphIcon icon="cloud-upload"/></div>
                <p className="text-center"  style={{fontSize: "2rem"}}>File(s) are Uploading...</p>
                <div className="text-center"><Loader customStyle={{fontSize: "2.5rem"}}/></div>
            </div>
        </>
    )
}