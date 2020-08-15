import React, { useRef } from 'react'
import ButtonGroup from "./ui/ButtonGroup";

export default function CreateNewFolder({ createNewFolder }) {
    const newFolderName = useRef();

    function onSubmitHandler(e){
        e.preventDefault();

        createNewFolder(newFolderName)
    }

    return (
        <form id="form_new_folder" onSubmit={onSubmitHandler}>
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
