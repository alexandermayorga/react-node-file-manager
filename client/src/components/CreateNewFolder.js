import React, { useRef } from 'react'
import ButtonGroup from "./ui/ButtonGroup";
import axios from 'axios';

export default function CreateNewFolder({ userID, parentFolderID, filePath, setLoading}) {
    const newFolderName = useRef();

    function createNewFolder(e) {
        e.preventDefault();
        if (!newFolderName.current.value) return;

        const newFolder = {
            name: newFolderName.current.value,
            userID,
            parentFolderID,
            filePath
        }

        // console.log(newFolder)

        axios.post('/api/new-folder', newFolder)
          .then((res) => { 
            newFolderName.current.value = '';
            setLoading(true)
           })
          .catch(err => console.log(err))
    }


    return (
        <form id="form_new_folder" onSubmit={createNewFolder}>
            <div className="form-group">
                <label htmlFor="foldername">Create new folder</label>
                <input ref={newFolderName} className="form-control" type="text" id="foldername" name="foldername" />
            </div>
            <ButtonGroup
                type="submit"
                name="new_folder_submit"
                modifierClass="btn-primary"
                glyphicon="glyphicon-folder-close"
            >Create</ButtonGroup>
        </form>
    )
}
