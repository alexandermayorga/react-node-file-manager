import React, { useRef, useContext } from "react";
import ButtonGroup from "./ui/ButtonGroup";
import { FetchContext } from "../context/FetchContext";

export default function CreateNewFolder({ parentFolderID, filePath, setLoading}) {
    const newFolderName = useRef();
    const { authAxios } = useContext(FetchContext);

    function createNewFolder(e) {
        e.preventDefault();
        if (!newFolderName.current.value) return;

        const newFolder = {
            name: newFolderName.current.value,
            parentFolderID,
            filePath
        }

        // console.log(newFolder)

        authAxios
          .post("new-folder", newFolder)
          .then((res) => {
            newFolderName.current.value = "";
            setLoading(true);
          })
          .catch((err) => console.log(err));
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
