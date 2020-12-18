const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

//DB Models
const { File } = require('./../models/file');

router.post('/files', async function (req, res, next) {
  try {
    const query = [{
      userID: req.user.sub,
      parentFolderID: req.body.parentFolderID
    }]

    if (req.body.parentFolderID !== "my-drive") {
      query.push({ _id: req.body.parentFolderID })
    }

    const files = await File.find({ $or: query })
    let folder = { filePath: [{ name: "My Drive", id: "my-drive" }] };
    if (req.body.parentFolderID !== "my-drive") {
      const newfolderIndex = files.findIndex(file => file._id == req.body.parentFolderID)
      folder = files.splice(newfolderIndex, 1)[0]
    }

    // console.log(newFolder);
    // console.log(folder);

    res.send({ files, folder})

  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Something went wrong." });

  }

})

router.post('/download', async function (req, res, next) {
  try {
    const file = await File.findById(req.body.id);

    if (!file.isFolder) return res.download(getFilePath(file))

    res.zip({
      files: [{ 
        path: getFilePath(file), 
        name: file.name 
      }],
      filename: file.name
    });

  } catch (err) {
    if (err) console.log(err);
    res.status(404).json({ message: "Error. Item Not Found" });
  
  }
})

router.post('/new-folder', (req,res)=>{
  //TODO: add Schema Validation
  //TODO: add Auth

  const folder = {
    filePath: req.body.filePath,
    userID: req.user.sub,
    name: req.body.name,
  }
  
  fs.mkdir(getFilePath(folder), { recursive: true }, err =>{
    if (err) console.log(err);
    if (err) return res.status(404).send('There was an error')

    const dbFolder = {
      name: req.body.name,
      userID: req.user.sub,
      parentFolderID: req.body.parentFolderID,
      filePath: req.body.filePath,
      isFolder: true
    }

    const folder = new File(dbFolder);

    folder.save( err => {
      if(err) return res.status(404).send('Something went very wrong')
      res.status(200).end('Folder Created!')
    })
  })

})

router.post('/delete', (req, res) => {
  const file = req.body.file;

  // console.log('[${getFilePath(file)}]', getFilePath(file));
  // Delete File(s) from server
  fs.remove(`${getFilePath(file)}`, err => {
    if (err) console.log(err);
    if (err) return res.status(400).json({ message: "There was an error removing the file" });

    // file/folder has been removed
    // Delete File from DB
    // 1. Delete by ID
    // 2. If it's a folder, delete all documents where parentFolderID match itemID
    if (!file.isFolder) {
      // console.log('[file to delete]', file)
      File.findOneAndDelete({ _id: file._id }, callback)
    } else {
      // console.log('[folder to delete]', file)
      File.deleteMany({
        $or: [
          { _id: file._id },
          { parentFolderID: file._id },
        ]
      }, callback)
    }
  })

  const callback = (err) => {
    if(err) return res
      .status(400)
      .json({ message: "There was an error deleting the file" });
    
    res.json({ message: "File has been removed" });
  }
})

router.post("/starred", async (req, res) => {
  try {
    const fileID = req.body.fileID;

    if (!fileID) return res.status(400).json({ message: "Bad Request" });

    const doc = await File.findOne({ _id: fileID});

    if(!doc) return res.status(404).json({message: 'Not Found'})
    
    if (doc.userID !== req.user.sub)
      return res.status(401).json({ message: "Unauthorized access request" });

    doc.starred = !doc.starred
    await doc.save()

    return res.json({ message: "Item Updated" });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      mesage: 'Something went wrong. Please try again.',error
    })
  }
});


/**
 * Builds the path of a file/folder
 * @param {Object} file File Document
 * @returns {String} {String} path of the file/folder in the server
 */
function getFilePath(file) {
  const buildFolderPath = file.filePath
    .map(path => path.name)
    .filter(name => name !== "My Drive")
    .join('/')

  let folderPath = `${UPLOADS_DIR}/${file.userID}`;
  if (buildFolderPath) folderPath += `/${buildFolderPath}`
  folderPath += `/${file.name}`

  // console.log('[getFilePath(file)]',folderPath);
  return folderPath
}

router.get("/test", function (req, res, next) {
  sharp(`${UPLOADS_DIR}/Jazz/images-1593197248121-2017-9-27-55826c (1).jpg`)
    .resize({ height: 200 })
    .toFile(`${UPLOADS_DIR}/Jazz/thumb_image.jpg`, (err, info) => {
      if (err) return console.log(err);
      console.log(info);
      res.end("ok");
    });
});

module.exports = router;
