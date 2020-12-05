import React from 'react'
import { useHistory } from "react-router-dom";
import "./style.css";

export default function FolderThumbnail({ file, onDownloadFile, onDeleteItem }) {
  let history = useHistory();

  function handleClickFileDelete() {
    onDeleteItem(file);
  }
  function handleClickFileDownload() {
    onDownloadFile(file);
  }
  function handleClickFolderOpen() {
    history.push(`/drive/${file._id}`);
  }

  return (
    <div className="col-xs-6 col-sm-4 col-lg-3">
      <div className="panel panel-default">
        <div className="panel-body" style={{ padding: "0" }}>
          <div
            className="caption noselect"
            title={file.name}
            onDoubleClick={handleClickFolderOpen}
            style={{ cursor: "default", padding: "15px" }}
          >
            <span
              className="glyphicon glyphicon-folder-open"
              aria-hidden="true"
              style={{ marginRight: "12px" }}
            ></span>
            {file.name}
          </div>
        </div>
        <div className="panel-footer">
          <div className="row">
            <div className="col-sm-12">
              <div className="text-right">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="File Actions"
                >
                  <button
                    className="btn btn-sm btn-danger api-delete"
                    aria-label="delete"
                    title="delete"
                    onClick={handleClickFileDelete}
                  >
                    <span
                      className="glyphicon glyphicon-trash"
                      aria-hidden="true"
                    ></span>
                  </button>
                  <button
                    className="btn btn-sm btn-default"
                    aria-label="download"
                    title="download"
                    onClick={handleClickFileDownload}
                  >
                    <span
                      className="glyphicon glyphicon-cloud-download"
                      aria-hidden="true"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
