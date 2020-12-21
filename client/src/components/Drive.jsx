import React, { useState, useEffect, useContext, useRef } from "react";
import axios from 'axios';
import isEmail from "validator/es/lib/isEmail";
import normalizeEmail from "validator/es/lib/normalizeEmail";

import Breadcrumbs from './Breadcrumbs';
import CreateNewFolder from './CreateNewFolder';
import UploadImage from './UploadImage';
import Loader from "./ui/Loader";
import DropZone from "./DropZone";
import ThumbnailList from "./Thumbnails";
import Modal from './ui/Modal';

import { FetchContext } from '../context/FetchContext';
import { useParams } from "react-router-dom";
import GlyphIcon from "./ui/GlyphIcon";

function Drive() {
  const {authAxios, deleteItem, starItem} = useContext(FetchContext);
  let {folderID} = useParams();
  const [filePath, setFilePath] = useState([])
  const [currentFiles, setCurrentFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const recipientRef = useRef()
  const [isNotifyChecked, setIsNotifyChecked] = useState(false)
  const [fileToShare, setFileToShare] = useState()
  
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
        console.log(err);
        // const {data} = err.response;
        // console.log(data);
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

  async function handleStarItem(file) {
    try {
      await starItem(file._id);

      const starredFileIndex = currentFiles.findIndex((item) => item._id === file._id)
      const newCurrentFiles = [...currentFiles]
      const fileToUpdate = newCurrentFiles[starredFileIndex]
      fileToUpdate['starred'] = !fileToUpdate['starred']
      setCurrentFiles(newCurrentFiles)

    } catch (error) {
      const {data} = (error.response);
      console.log(data);
    }
  }

  function handleItemShare(file) {
    setFileToShare(file);
    setIsModalOpen(true);
  }
  function handleFormSubmitItemShare(e) {
    e.preventDefault();

    const email = recipientRef.current.value;
    if (!isEmail(email)) return alert("Invalid Email");

    const normalEmail = normalizeEmail(email);

    if (fileToShare.shared.includes(normalEmail)) return alert(`Already shared with: ${normalEmail}`);

    // console.log(isNotifyChecked);

    authAxios
      .patch("share/add", { fileID: fileToShare._id, email: normalEmail })
      .then((res) => {
        const newFileToShare = { ...fileToShare };
        newFileToShare.shared.push(email);

        setFileToShare(newFileToShare);

        const newCurrentFiles = [...currentFiles];
        const fileIndex = newCurrentFiles.findIndex(
          (file) => file._id === newFileToShare._id
        );
        if (fileIndex >= 0) {
          newCurrentFiles[fileIndex] = newFileToShare;
          setCurrentFiles(newCurrentFiles);
        }

        recipientRef.current.value = '';

        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        const { data } = err.response;
        console.log(data);
      });

    //Do API Stuff
  }
  function handleClickRemoveShared(email) {
    authAxios
      .patch("share/remove", { fileID: fileToShare._id, email })
      .then((res) => {
        const newFileToShare = { ...fileToShare };
        const newShared = newFileToShare.shared.filter(
          (userEmail) => userEmail !== email
        );
        newFileToShare.shared = newShared
        setFileToShare(newFileToShare);


        const newCurrentFiles = [...currentFiles];
        const fileIndex = newCurrentFiles.findIndex((file) => file._id === newFileToShare._id); 

        if (fileIndex >= 0 ){
          newCurrentFiles[fileIndex] = newFileToShare;
          setCurrentFiles(newCurrentFiles);
        }
         console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        const { data } = err.response;
        console.log(data);
      });
  }

  function renderSharedWith() {
    const UL_STYLE = {
      display: "flex",
      padding: 0,
      margin: 0,
      listStyleType: "none",
    };

    const LI_STYLE = {
      background: "rgba(0,0,0, .1)",
      borderRadius: "15px",
      padding: "3px 12px",
      marginRight: "8px",
    };

    const REMOVE_STYLE = {
      transform: "translateY(1.4px)",
      fontSize: "1.3rem",
      marginLeft: "5px",
      color: "rgba(0,0,0,0.5)",
      cursor: "pointer"
    };

    return (
      <>
        <hr />
        <div className="h5">Shared with</div>
        <ul style={UL_STYLE}>
          {fileToShare.shared.map((email) => (
            <li key={email} style={LI_STYLE}>
              {email}{" "}
              <span
                style={REMOVE_STYLE}
                onClick={() => handleClickRemoveShared(email)}
              >
                <GlyphIcon icon={"remove"} />
              </span>
            </li>
          ))}
        </ul>
      </>
    );
  }

  function FolderIsEmpty() {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
          minHeight: "200px",
          flexDirection: "column",
          color: "gray",
        }}
      >
        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Folder is Empty...
        </div>
        <div style={{ fontSize: "1.8rem" }}>
          It feels lonely here, how about adding some awesome pictures!
        </div>
      </div>
    );
  }

  const folders = currentFiles.filter((item) => item.isFolder);
  const files = currentFiles.filter((item) => !item.isFolder);

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
          {loading ? (
            <div
              className="loader_wrapper"
              style={{
                display: "flex",
                width: "100%",
                height: "200px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader />
            </div>
          ) : (
            <DropZone
              onUpload={handleUpload}
              parentFolderID={folderID}
              filePath={filePath}
            >
              {currentFiles.length < 1 ? (
                <FolderIsEmpty />
              ) : (
                <div className="row">
                  {folders.length > 0 && (
                    <div className="col-sm-12">
                      <div className="h5" style={{ marginBottom: "20px" }}>
                        Folders
                      </div>
                      <div className="row">
                        <ThumbnailList
                          files={folders}
                          deleteItem={handleFileDelete}
                          starItem={handleStarItem}
                        />
                      </div>
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="col-sm-12">
                      <div className="h5" style={{ marginBottom: "20px" }}>
                        Files
                      </div>

                      <div className="row">
                        <ThumbnailList
                          files={files}
                          deleteItem={handleFileDelete}
                          starItem={handleStarItem}
                          shareItem={handleItemShare}
                        />
                      </div>
                    </div>
                  )}

                  <Modal isOpen={isModalOpen} close={setIsModalOpen}>
                    <Modal.Header>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span
                          aria-hidden="true"
                          onClick={() => setIsModalOpen(false)}
                        >
                          &times;
                        </span>
                      </button>
                      <div className="modal-title h4">Share with people</div>
                    </Modal.Header>
                    <Modal.Body>
                      <form onSubmit={handleFormSubmitItemShare}>
                        <div className="form-group">
                          <label
                            htmlFor="recipient-name"
                            className="control-label"
                          >
                            Recipient:
                          </label>
                          <div
                            className="input-group"
                            style={{ marginBottom: "15px" }}
                          >
                            <input
                              type="text"
                              id="recipient-name"
                              className="form-control"
                              placeholder="Add people ( i.e myfriend@email.com )"
                              ref={recipientRef}
                            />
                            <span className="input-group-btn">
                              <button className="btn btn-success" type="submit">
                                Add
                              </button>
                            </span>
                          </div>
                          {/* <!-- /input-group --> */}
                        </div>
                        <div className="form-group">
                          <div className="checkbox">
                            <label>
                              <input
                                type="checkbox"
                                onChange={() =>
                                  setIsNotifyChecked(!isNotifyChecked)
                                }
                              />
                              <strong>Notify by mail</strong>
                            </label>
                          </div>
                        </div>
                        {isNotifyChecked && (
                          <div className="form-group">
                            <label
                              htmlFor="message-text"
                              className="control-label"
                            >
                              Message:
                            </label>
                            <textarea
                              className="form-control"
                              id="message-text"
                              placeholder="Add a message..."
                            ></textarea>
                          </div>
                        )}
                        {fileToShare &&
                          fileToShare.shared.length > 0 &&
                          renderSharedWith()}
                      </form>
                    </Modal.Body>
                    <Modal.Footer>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        type="button"
                        className="btn btn-default"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </Modal.Footer>
                  </Modal>
                </div>
              )}
            </DropZone>
          )}
        </div>
      </div>
    </>
  );
}

export default Drive;