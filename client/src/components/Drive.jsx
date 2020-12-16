import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import Breadcrumbs from './Breadcrumbs';
import CreateNewFolder from './CreateNewFolder';
import UploadImage from './UploadImage';
import Loader from "./ui/Loader";
import DropZone from "./DropZone";
import ThumbnailList from "./Thumbnails";

import { FetchContext } from '../context/FetchContext';
import { useParams } from "react-router-dom";

function Drive() {
  const {authAxios, deleteItem} = useContext(FetchContext);
  let {folderID} = useParams();
  const [filePath, setFilePath] = useState([])
  const [currentFiles, setCurrentFiles] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    let cancel;

    const directoryRequest = {
      parentFolderID: folderID
    }

    authAxios.post('files', directoryRequest, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then((res) => {

        const filePath = [...res.data.folder.filePath]
        
        if (res.data.folder.name) {
          const {name,_id} = res.data.folder;
          filePath.push({
              name,
              id: _id
          })
        }
          
        setCurrentFiles(res.data.files)
        setFilePath(filePath)
        setLoading(false)
      })
      .catch(err =>{
        const {data} = err.response;
        console.log(data);
      })

    //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
    return () => cancel(); 

  }, [loading,authAxios,folderID])

  function handleFileDelete(file) {
    deleteItem(file,(err, res)=>{
      if(err) return alert('There was an issue deleting your file, please try again.');

      const newCurrentFiles = currentFiles.filter(cFile => cFile._id !== file._id)
      setCurrentFiles(newCurrentFiles)

    })
  }

    function handleUpload(files) {
      setCurrentFiles(prevCurrentFiles =>{
        const newCurrentFiles = [...prevCurrentFiles,...files]
        return newCurrentFiles
      })
    }

  return (
    <>
        <div className="row">

          <div className="col-sm-6">
            <div className="well">
              <UploadImage
                setLoading={setLoading}
                onUpload={handleUpload}
                parentFolderID={folderID}
                filePath={filePath}
              />
            </div>
          </div>

          <div className="col-sm-6">
            <div className="well">
              <CreateNewFolder 
                parentFolderID={folderID}
                filePath={filePath}
                setLoading={setLoading}
               />
            </div>
          </div>

        </div>

        <div className="row">

          <div className="col-sm-12">
            <Breadcrumbs filePath={filePath} />
          </div>

        </div>

        <div className="row">
          <div className="col-sm-12">
            {
            loading ?
              <div className="loader_wrapper"
                style={{
                  display: "flex",
                  width: "100%",
                  height: "200px",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Loader />
              </div>
            :
            <DropZone 
              onUpload={handleUpload}
              parentFolderID={folderID}
              filePath={filePath}
            >
              {
                currentFiles.length < 1 ?
                <FolderIsEmpty/>
                :
                <div className="row">
                    {currentFiles.filter(item => item.isFolder).length > 0 &&
                    <div className="col-sm-12">
                        <div className="h5" style={{ marginBottom: "20px" }}>Folders</div>
                        <div className="row">
                            <ThumbnailList 
                              files={currentFiles.filter(item => item.isFolder)} 
                              deleteItem={handleFileDelete} 
                            />
                        </div>
                    </div>
                    }

                    {currentFiles.filter(item => !item.isFolder).length > 0 &&
                    <div className="col-sm-12">
                        <div className="h5" style={{ marginBottom: "20px" }}>Files</div>

                        <div className="row">
                            <ThumbnailList 
                              files={currentFiles.filter(item => !item.isFolder)} 
                              deleteItem={handleFileDelete} 
                            />
                        </div>
                    </div>
                    }
                </div>
              }
            </DropZone>
            }

            </div>
        </div>
    </>
  );
}

function FolderIsEmpty(){
  return(
      <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
          minHeight: "200px",
          flexDirection: "column",
          color: "gray"
      }}>
        <div style={{fontSize: "2rem",fontWeight: "bold"}}>
          Folder is Empty...
        </div>
        <div style={{fontSize: "1.8rem"}}>
          It feels lonely here, how about adding some awesome pictures!
        </div>
      </div>
  )
}

export default Drive;