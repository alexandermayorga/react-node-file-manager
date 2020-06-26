import React, {useRef} from 'react'

export default function UploadImage({fileUpload}) {
    const fileInput = useRef()

    function onSubmitHandler(e) {
        e.preventDefault();
        if (fileInput.current.files.length === 0) return;
        fileUpload(fileInput)
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
                />
                <p className="help-block">Only ".jpg | .png" allowed</p>
            </div>
            <button type="submit" name="submit" className="btn btn-success">
                <span className="glyphicon glyphicon-cloud-upload" aria-hidden="true"></span> Upload
            </button>
        </form>
    )
}
