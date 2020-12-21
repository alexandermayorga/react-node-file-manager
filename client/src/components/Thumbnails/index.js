import React,{ useContext } from 'react'
import { FetchContext } from '../../context/FetchContext';
import FolderThumbnail from './FolderThumbnail'
import ImageThumbnail from './ImageThumbnail'

export default function ThumbnailList({ files, deleteItem, starItem, shareItem }) {
  const { downloadItem } = useContext(FetchContext);

  return files.map((file) => {
    return file.isFolder ? (
      <FolderThumbnail
        key={file._id}
        file={file}
        onDownloadFile={downloadItem}
        onDeleteItem={deleteItem}
        onStarItem={starItem}
      />
    ) : (
      <ImageThumbnail
        key={file._id}
        file={file}
        onDownloadFile={downloadItem}
        onDeleteItem={deleteItem}
        onStarItem={starItem}
        onShareItem={shareItem}
      />
    );
  });
}
