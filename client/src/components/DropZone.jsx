import React, {useState} from 'react'
import axios from 'axios';
import classes from './DropZone.module.css'

export default function DropZone({userID,setLoading,parentFolderID,filePath,children}) {

    const [draggingOver, setDraggingOver] = useState(false)

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
        
        alert('Uploading')
        setDraggingOver(false)

        axios.post('/api/upload', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then( res => setLoading(true) )
            .catch(err => {
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
            className={`clearfix ${draggingOver && classes.dropZone}`}
        >
            {
                draggingOver ? 
                    <>
                        <DropBox/>
                        <DropHere/>
                    </>
                    :
                    children
            }
        </div>
    )
}


function DropBox(){
    return (
        <div className={classes.dropZone__box}></div>
    )
}

function DropHere(){
    return (
        <div className={classes.dropZone__visualCue}>
            <span className='glyphicon glyphicon-cloud' aria-hidden="true"></span> Drop Files Here
        </div>
    )
}