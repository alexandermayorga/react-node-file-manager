import React, {useState} from 'react'
import DropFilesHere from "./DropFilesHere";
import Thumbnails from "../Thumbnails";

export default function FilesContainer({
    files,
    ...restProps
}) {
    const [dragging, setDragging] = useState(false)

        //     onDragEnter={props.onDragEnter} 
        //     onDragLeave={props.onDragLeave}
        //     onDragOver={props.onDragOver} 

    function draggingOver(e) {
        e.preventDefault()
        console.log('dragging Over!!')
        setDragging(true)
    }
    function draggingLeave(e) {
        console.log('dragging Leave!!')
        setDragging(false)
    }

    function dropFiles(ev) {
        ev.preventDefault()
        console.log('File Has been dropped')
        const files = [];
        let formData = new FormData()

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    const file = ev.dataTransfer.items[i].getAsFile();
                    files.push(file)
                    formData.append('images', file, file.name)
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
                files.push(ev.dataTransfer.files[i])
                formData.append('images', files[i], files[i].name)
            }
        }
        // axios.post('/api/upload', formData, { params: { filePath: encodeURI(currentDir) } })
        //     .then((res) => {
        //         setLoading(true)
        //         setDragging(false)
        //     })
        //     .catch(err => console.log("Upload Error", err))

    }


    const folders = files.filter(item => item.isFolder);
    const newFiles = files.filter(item => !item.isFolder);
 
    return (
        <>
            <div className="col-sm-12">
                <div className="h5" style={{ marginBottom: "20px" }}>Folders</div>
                <div className="row">
                    <Thumbnails files={folders} {...restProps} />
                </div>
            </div>
            <div className="col-sm-12">
                <div className="h5" style={{ marginBottom: "20px" }}>Files</div>

                <div className="row">
                    <Thumbnails files={newFiles} {...restProps} />
                </div>
            </div>
        </>
    )
}
