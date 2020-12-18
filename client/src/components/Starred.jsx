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

function Starred() {
  const [loading, setLoading] = useState(true)
  const {authAxios, deleteItem, starItem} = useContext(FetchContext);
  const [currentFiles, setCurrentFiles] = useState([])

  useEffect(() => {
    let cancel;

    authAxios.get('starred', {
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then((res) => {
          
        setCurrentFiles(res.data.files)
        setLoading(false)
      })
      .catch(err =>{
        const {data} = err.response;
        alert(data.message);
      })

    //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
    return () => cancel(); 

  }, [])

  function handleFileDelete(file) {
    deleteItem(file,(err, res)=>{
      if(err) return alert('There was an issue deleting your file, please try again.');

      const newCurrentFiles = currentFiles.filter(cFile => cFile._id !== file._id)
      setCurrentFiles(newCurrentFiles)

    })
  }

  async function handleStarItem(file) {
    try {
      await starItem(file._id);

      // const starredFileIndex = currentFiles.findIndex((item) => item._id === file._id)
      // const newCurrentFiles = [...currentFiles]
      // const fileToUpdate = newCurrentFiles[starredFileIndex]
      // fileToUpdate['starred'] = !fileToUpdate['starred']
      setCurrentFiles(prevCurrentFiles => {
        const newCurrentFiles = prevCurrentFiles.filter(item => item._id !== file._id)
        return newCurrentFiles
      })

    } catch (error) {
      const {data} = (error.response);
      alert(data.message);
    }
  }

  const folders = currentFiles.filter(item => item.isFolder);
  const files = currentFiles.filter(item => !item.isFolder);

  return (
    <>
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
            <>
              {
                currentFiles.length < 1 ?
                <Empty/>
                :
                <div className="row">
                    {folders.length > 0 &&
                    <div className="col-sm-12">
                        <div className="h5" style={{ marginBottom: "20px" }}>Folders</div>
                        <div className="row">
                            <ThumbnailList 
                              files={folders} 
                              deleteItem={handleFileDelete}
                              starItem={handleStarItem}
                            />
                        </div>
                    </div>
                    }

                    {files.length > 0 &&
                    <div className="col-sm-12">
                        <div className="h5" style={{ marginBottom: "20px" }}>Files</div>

                        <div className="row">
                            <ThumbnailList 
                              files={files} 
                              deleteItem={handleFileDelete}
                              starItem={handleStarItem}
                            />
                        </div>
                    </div>
                    }
                </div>
              }
            </>
            }
            </div>
        </div>
    </>
  );
}

function Empty(){
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
          No Starred Files yet...
        </div>
        <div style={{fontSize: "1.8rem"}}>
          Go smash the star button on your favorite files!
        </div>
      </div>
  )
}

export default Starred;