import React from 'react'
import FolderThumbnail from './FolderThumbnail'
import ImageThumbnail from './ImageThumbnail'
import axios from 'axios';

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

    function deleteItem(file) {
        axios.post('/api/delete', { file })
            .then((res) => { 
                // console.log(file._id + " Soon to be deleted");
                props.setLoading(true)
             })
            .catch(err => console.log("Error", err))
    }

    function downloadFolder(file) {
        axios.get(`/api/download/${file._id}`, {
            responseType: 'blob' // !important to download the file 
        })
            .then((res) => {
                // 2. Create blob link to download
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.name);
                // 3. Append to html page
                document.body.appendChild(link);
                // 4. Force download
                link.click();
                // 5. Clean up and remove the link
                link.parentNode.removeChild(link);


            })
            .catch((err) => {
                console.log(err)
            })

        return;
    }
    function downloadFile(file) {
        // console.log(file);

        axios.get(`/api/download/${file._id}`, {
            responseType: 'blob' // !important to download the file 
        })
            .then((res) => {
                // console.log(res.data);

                /*
                  https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
                  https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
                */

                // 2. Create blob link to download
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${file.name}${file.isFolder ? '.zip' : ''}`);
                // 3. Append to html page
                document.body.appendChild(link);
                // 4. Force download
                link.click();
                // 5. Clean up and remove the link
                link.parentNode.removeChild(link);

            })
            .catch(err => console.log(err))

    }


    return (
        props.files.map(file =>{
            return file.isFolder ? 
                <FolderThumbnail 
                    key={file._id} 
                    file={file} 
                    deleteFile={deleteItem} 
                    downloadFile={downloadFile} 
                />
                :
                <ImageThumbnail 
                    key={file._id} 
                    file={file} 
                    deleteFile={deleteItem} 
                    downloadFile={downloadFile} 
                />
        })
    )
}
