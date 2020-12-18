import React from 'react'
import GlyphIcon from '../ui/GlyphIcon';
import "./style.css";

export default function ImageThumbnail({ file, onDownloadFile, onDeleteItem, onStarItem }) {
  const imgPath = file.filePath
    .map((path) => path.name)
    .filter((name) => name !== "My Drive")
    .join("/");

  //file size comes in bytes. This transforms it to kilobytes
  const fileSize = Math.round(file.size / 1000);
  const {starred} = file

  function handleClickFileDelete() {
    onDeleteItem(file);
  }
  function handleClickFileDownload() {
    onDownloadFile(file);
  }
  function handleStarItem() {
    onStarItem(file);
  }

  return (
    <div className="col-xs-6 col-sm-4 col-lg-3">
      <div className="panel panel-default">
        <div className="panel-body">
          <img
            src={`/uploads/${file.userID}/${imgPath && `${imgPath}/`}${
              file.name
            }`}
            className="img-responsive center-block img-thumbnail"
            alt={file.name}
          />

          <div className="caption" title={file.name}>
            <span
              className="glyphicon glyphicon-picture"
              aria-hidden="true"
              style={{ marginRight: "12px" }}
            ></span>
            {file.name}
          </div>
        </div>

        <div className="panel-footer">
          <div className="row">
            <div className="col-xs-4">
              <div className="text-muted">{`${fileSize}kb`}</div>
            </div>
            <div className="col-xs-8">
              <div className="text-right">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="File Actions"
                >
                  <button
                    className="btn btn-sm btn-default"
                    aria-label="delete"
                    title="delete"
                    onClick={handleClickFileDelete}
                  >
                    <GlyphIcon icon="trash" />
                  </button>
                  <button
                    className={`btn btn-sm btn-${
                      starred ? "warning" : "default"
                    }`}
                    aria-label="favorite"
                    title="favorite"
                    onClick={handleStarItem}
                  >
                    <GlyphIcon icon={starred ? "star" : "star-empty"} />
                  </button>
                  <button
                    className="btn btn-sm btn-default"
                    aria-label="download"
                    title="download"
                    onClick={handleClickFileDownload}
                  >
                    <GlyphIcon icon="cloud-download" />
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
