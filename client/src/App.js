import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import axios from 'axios';
import Header from './components/Header';
import Thumbnails from './components/Thumbnails';
import Breadcrumbs from './components/Breadcrumbs';
import CreateNewFolder from './components/CreateNewFolder';
import UploadImage from './components/UploadImage';

function App() {
  const [currentFiles, setCurrentFiles] = useState()
  const [currentDir, setCurrentDir] = useState('/')
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    let cancel;
    axios.get('api/files', { 
      params: { directory: encodeURI(currentDir)},
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then((res) => {
        console.log(res.data)
        setCurrentFiles(res.data)
        setLoading(false)
      })
      .catch(err => console.log(err))

    //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
    return () => cancel(); 

  }, [currentDir,loading])

  function createNewFolder(input) {
    if (!input) return;

    axios.post('/api/new-folder', { newFolderName: `${currentDir}${input.current.value}` })
      .then((res) => { 
        input.current.value = '';
        setLoading(true)
       })
      .catch(err => console.log(err))
  }

  function fileUpload(input) {
    let uploadFormHTML = document.getElementById('form_upload');
    let formData = new FormData(uploadFormHTML);

    axios.post('/api/upload', formData, { params: { filePath: encodeURI(currentDir) } })
      .then((res) => { 
        input.current.value = '';
        setLoading(true)
       })
      .catch(err => console.log("Upload Error", err))
  }

  function deleteFile(fileName) {
    axios.post('/api/delete', { path: `${currentDir}${fileName}`  })
      .then((res) => { setLoading(true) })
      .catch(err => console.log("Error", err))
  }
  
  function openFolder(file) {
    setCurrentDir(`${currentDir}${file.fileName}/`)
  }

  function breadcrumbsClick(filePath){
    setCurrentDir(filePath)
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

  function draggingOver(e) {
    e.preventDefault()
    setDragging(true)
    console.log('dragging Over!!')
  }
  function draggingLeave(e) {
    e.preventDefault()
    setDragging(false)
    console.log('dragging Leave!!')
  }

  function draggingEnter(e) {
    e.preventDefault()
  }

  function dropFiles(ev) {
    ev.preventDefault()
    const files = [];
    let formData = new FormData()

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          const file = ev.dataTransfer.items[i].getAsFile();
          files.push(file)
          formData.append('images', file, file.name)
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        files.push(ev.dataTransfer.files[i])
        formData.append('images', files[i], files[i].name)
      }
    } 
    axios.post('/api/upload', formData, { params: { filePath: encodeURI(currentDir) } })
      .then((res) => {
        setLoading(true)
        setDragging(false)
      })
      .catch(err => console.log("Upload Error", err))

  }


  return (
    <>
      <Header />

      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <div className="well">
              <UploadImage fileUpload={fileUpload}/>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="well">
              <CreateNewFolder createNewFolder={createNewFolder} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <Breadcrumbs path={currentDir} goToFolder={breadcrumbsClick}/>
          </div>
        </div>
      </div>

      <div className="container">
        {/* <div className="row">
          <div className="col-sm-12">
            <div className="bs-callout bs-callout-info" id="callout-helper-bg-specificity">
              <h4>Dealing with specificity</h4>
              <p>Sometimes contextual background classes cannot be applied due to the specificity of another selector. In some cases, a sufficient workaround is to wrap your element's content in a <code>&lt;div&gt;</code> with the class.</p>
            </div>
          </div>
        </div> */}
        <div className="row">
          {!currentFiles && <div className="col-sm-12">Loading...</div>}
          {currentFiles && currentFiles.length === 0 && <div className="col-sm-12">Folder is Empty...</div>}
          {
            currentFiles 
            && 
            <Thumbnails 
              files={currentFiles} 
              deleteFile={deleteFile} 
              downloadFile={downloadFile}
              openFolder={openFolder}
              dragging={dragging}
              onDragOver={draggingOver}
              onDrop={dropFiles}
              onDragLeave={draggingLeave}
              onDragEnter={draggingEnter}
            />
          }
        </div>
      </div>
    </>
  );
}

export default App;
