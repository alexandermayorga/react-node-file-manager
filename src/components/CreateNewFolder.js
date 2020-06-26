import React, { useRef } from 'react'

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
            <button type="submit" name="submit" className="btn btn-primary">
                <span className="glyphicon glyphicon-folder-close" style={{ marginRight: "5px" }} aria-hidden="true"></span>
                Create
            </button>
        </form>
    )
}
