import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Breadcrumbs from './Breadcrumbs';
import CreateNewFolder from './CreateNewFolder';
import UploadImage from './UploadImage';
import Loader from "./ui/Loader";
import Layout from './hoc/Layout';
import DropZone from "./DropZone";
import ThumbnailList from "./Thumbnails";

import { deleteItem } from "../api";

import { useParams } from "react-router-dom";

function Drive({user}) {
  let {folderID} = useParams();
  const [filePath, setFilePath] = useState([])
  const [currentFiles, setCurrentFiles] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    let cancel;

    const directoryRequest = {
      userID: user.id,
      parentFolderID: folderID
    }

    axios.post('/api/files', directoryRequest, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then((res) => {
        // console.log(res.data)
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
      .catch(err => console.log(err))

    //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
    return () => cancel(); 

  }, [loading])

  function handleFileDelete(file) {
    deleteItem(file,(err, res)=>{
      if(err) return alert('There was an issue deleting your file, please try again.');

      const newCurrentFiles = currentFiles.filter(cFile => cFile._id !== file._id)
      setCurrentFiles(newCurrentFiles)

    })
  }

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">

          <div className="col-sm-6">
            <div className="well">
              <UploadImage
                userID={user.id}
                setLoading={setLoading}
                parentFolderID={folderID}
                filePath={filePath}
              />
            </div>
          </div>

          <div className="col-sm-6">
            <div className="well">
              <CreateNewFolder 
                userID ={user.id}
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
      </div>{/* container */}

      <div className="container-fluid">
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
              userID={user.id}
              setLoading={setLoading}
              parentFolderID={folderID}
              filePath={filePath}
            >
              {
                currentFiles.length < 1 ?
                <>
                  Folder is Empty...
                </>
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
      </div>
    </Layout>
  );
}

export default Drive;