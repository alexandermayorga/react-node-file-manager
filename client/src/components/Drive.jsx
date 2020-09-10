import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Breadcrumbs from './Breadcrumbs';
import CreateNewFolder from './CreateNewFolder';
import UploadImage from './UploadImage';
import Loader from "./ui/Loader";
import FilesContainer from "./FilesContainer";
import Layout from './hoc/Layout';

import { useParams } from "react-router-dom";

function Drive({user}) {
  let {folderID} = useParams();
  const [filePath, setFilePath] = useState([])
  const [currentFiles, setCurrentFiles] = useState()
  // const [currentDir, setCurrentDir] = useState('/my-drive')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    let cancel;

    const request = {
      userID: user.id,
      parentFolderID: folderID
    }

    axios.post('/api/files', request, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then((res) => {
        // console.log(res.data)
        setCurrentFiles(res.data.files)
        const filePath = [...res.data.folder.filePath]

        if (res.data.folder.name) filePath.push(
          {
            name: res.data.folder.name,
            id: res.data.folder._id
          }
        )

        setFilePath(filePath)
        setLoading(false)
      })
      .catch(err => console.log(err))

    //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
    return () => cancel(); 

  }, [loading])

  function fileUpload(input) {
    let uploadFormHTML = document.getElementById('form_upload');
    let formData = new FormData(uploadFormHTML);

    axios.post('/api/upload', formData, { params: { filePath: encodeURI(folderID) } })
      .then((res) => { 
        input.current.value = '';
        setLoading(true)
       })
      .catch(err => console.log("Upload Error", err))
  }

  function deleteFile(fileName) {
    axios.post('/api/delete', { path: `${folderID}${fileName}`  })
      .then((res) => { setLoading(true) })
      .catch(err => console.log("Error", err))
  }

  function downloadFile(file) {
    if (file.isDirectory) {

      axios.get('api/download-folder', {
        params: {
          filePath: encodeURI(file.filePath),
          fileName: encodeURI(file.fileName)
         },
        responseType: 'blob' // !important to download the file 
      })
        .then((res)=>{
          console.log(res.data)

          // 2. Create blob link to download
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.fileName);
          // 3. Append to html page
          document.body.appendChild(link);
          // 4. Force download
          link.click();
          // 5. Clean up and remove the link
          link.parentNode.removeChild(link);


        })
        .catch((err) => {
          console.log(err)
        })

      return;
    }
    
    axios.get('api/download', {
      params: { filePath: encodeURI(file.filePath) },
      responseType: 'blob' // !important to download the file 
    })
      .then((res) => {

        /*
          https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
          https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
        */

        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.fileName);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
        
      })
      .catch(err => console.log(err))
    
  }

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">

          <div className="col-sm-6">
            <div className="well">
              <UploadImage fileUpload={fileUpload} />
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
            {
              filePath.length > 0
              &&
              <Breadcrumbs filePath={filePath} />
            }
          </div>

        </div>
      </div>{/* container */}

      {
        !currentFiles
        &&
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
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
            </div>

          </div>
        </div>
      }

      {
        currentFiles && currentFiles.length === 0
        &&
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              Folder is Empty...
            </div>
          </div>
        </div>
      }

      {
        currentFiles && currentFiles.length > 0
        &&
        <div className="container-fluid">
          <div className="row">
            <FilesContainer
              files={currentFiles}
              deleteFile={deleteFile}
              downloadFile={downloadFile}
            />
          </div>
        </div>
      }
    </Layout>
  );
}

export default Drive;
