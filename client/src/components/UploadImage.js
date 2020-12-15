import React, { useRef, useContext } from "react";
import ButtonGroup from "./ui/ButtonGroup";
import { FetchContext } from "../context/FetchContext";


export default function UploadImage({ parentFolderID, filePath, onUpload }) {
  const fileInput = useRef();
  const { authAxios } = useContext(FetchContext);

  function onSubmitHandler(e) {
    e.preventDefault();
    if (fileInput.current.files.length === 0) return;
    fileUpload(fileInput);
  }

  function fileUpload(fileInput) {
    let newFormData = new FormData();

    newFormData.append("parentFolderID", parentFolderID);
    newFormData.append("filePath", JSON.stringify({ filePath }));

    let files = [...fileInput.current.files];
    files.map((file) => {
      if (file.type !== "image/jpeg" && file.type !== "image/png") return null;
      return newFormData.append("images", file, file.name);
    });

    //TODO: let the user know if a file is not a valid file type for upload

    authAxios
      .post("upload", newFormData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        fileInput.current.value = "";

        const { message, files } = res.data;
        alert(message);
        
        onUpload(files);
      })
      .catch((err) => {
        alert("Upload Error");
        console.log(err.response);
      });
  }

  return (
    <form id="form_upload" onSubmit={onSubmitHandler}>
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
      >
        Upload
      </ButtonGroup>
    </form>
  );
}
