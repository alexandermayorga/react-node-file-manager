import React, { useRef, useContext } from "react";
import ButtonGroup from "./ui/ButtonGroup";
import { FetchContext } from "../context/FetchContext";


export default function UploadImage({ parentFolderID, filePath, setLoading}) {
    const fileInput = useRef()
    const { authAxios } = useContext(FetchContext);

    function onSubmitHandler(e) {
        e.preventDefault();
        if (fileInput.current.files.length === 0) return;
        fileUpload(fileInput)
    }

    function fileUpload(input) {
        let uploadFormHTML = document.getElementById('form_upload');
        let formData = new FormData(uploadFormHTML);

        // formData.append('userID', userID);
        formData.append('parentFolderID', parentFolderID);
        formData.append('filePath', JSON.stringify({filePath}));

        authAxios
          .post("upload", formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            input.current.value = "";
            setLoading(true);
          })
          .catch((err) => {
              console.log("Upload Error", err);
              console.log(err.response);
          });
    }

    // function inputChangeHandler(){
    //     console.log('[Form Changed!]');
    // }

    return (
        <form id="form_upload" onSubmit={onSubmitHandler} >
            <div className="form-group">
                <label htmlFor="images">Upload Images</label>
                <input 
                    type="file" 
                    name="images" 
                    multiple 
                    ref={fileInput} 
                    accept="image/png, image/jpeg"
                    // onChange={inputChangeHandler}
                />
                <p className="help-block">Only ".jpg | .png" allowed</p>
            </div>
            <ButtonGroup
                type="submit"
                name="img_upload_submit"
                modifierClass="btn-success"
                glyphicon="glyphicon-cloud-upload"
            >Upload</ButtonGroup>
        </form>
    )
}
