import React from 'react'
import FolderThumbnail from './FolderThumbnail'
import ImageThumbnail from './ImageThumbnail'

import { downloadItem } from "../../api";

export default function ThumbnailList({ files, deleteItem }) {
  return files.map((file) => {
    return file.isFolder ? (
      <FolderThumbnail
        key={file._id}
        file={file}
        onDownloadFile={downloadItem}
        onDeleteItem={deleteItem}
      />
    ) : (
      <ImageThumbnail
        key={file._id}
        file={file}
        onDownloadFile={downloadItem}
        onDeleteItem={deleteItem}
      />
    );
  });
}
