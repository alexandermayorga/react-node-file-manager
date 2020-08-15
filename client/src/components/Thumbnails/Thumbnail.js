import React from 'react'
import "./style.css";

export default function Thumbnail({ file, deleteFile, downloadFile, openFolder }) {
    function deleteFileHandler() {
        deleteFile(file.fileName)
    }
    function downloadFileHandler() {
        downloadFile(file)
    }

    function openFolderHandler(){
        openFolder(file)
    }

    return (
        <div className="col-xs-6 col-sm-4 col-lg-3">
            <div className="panel panel-default">

                <div className="panel-body">
                    {
                        file.isDirectory
                        &&
                        <div className="thumbnail thumbnail-folder" onDoubleClick={openFolderHandler}>
                            <span className="glyphicon-thumbnail center-block text-center">
                                <span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
                            </span>
                        </div>
                    }
                    {
                        !file.isDirectory
                        && 
                        <img src={`/uploads${file.parentDir}${file.fileName}`} className="img-responsive center-block img-thumbnail"
                            alt={file.fileName} />
                    }

                    <div className="caption" title={file.fileName}>
                        <span className="glyphicon glyphicon-folder-open" aria-hidden="true" style={{marginRight: "12px"}}></span>{file.fileName}
                    </div>

                </div>
                <div className="panel-footer">
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="text-muted">
                                {file.size && file.size}
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="text-right">
                            <div className="btn-group" role="group" aria-label="File Actions">
                                <button
                                    className="btn btn-sm btn-danger api-delete"
                                    aria-label="delete"
                                    title="delete"
                                    onClick={deleteFileHandler}
                                >
                                    <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                </button>
                                <button
                                    className="btn btn-sm btn-default"
                                    aria-label="download"
                                    title="download"
                                    onClick={downloadFileHandler}
                                >
                                    <span className="glyphicon glyphicon-cloud-download" aria-hidden="true"></span>
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
