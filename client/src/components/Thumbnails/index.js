import React,{ useContext } from 'react'
import { FetchContext } from '../../context/FetchContext';
import FolderThumbnail from './FolderThumbnail'
import ImageThumbnail from './ImageThumbnail'

export default function ThumbnailList({ files, deleteItem }) {
  
  const { downloadItem } = useContext(FetchContext);

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
