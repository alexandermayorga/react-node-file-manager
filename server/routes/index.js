const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

//DB Models
const { File } = require('./../models/file');
// const { resolve } = require('path');

// router.get('/files', lstatAsync, function (req, res, next) {

//     res.json(req.filesInfo)

// })

router.post('/files', async function (req, res, next) {
  //TODO: Convert to one Request
  try {
    // const files = await File.find({
    //   userID: req.body.userID,
    //   parentFolderID: req.body.parentFolderID
    // })

    // const folder = (req.body.parentFolderID === "my-drive") ?
    //   { filePath: [{ name: "My Drive", id: "my-drive"}]}
    //   :
    //   await File.findById(req.body.parentFolderID)


    const query = [{
      userID: req.body.userID,
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
    res.sendStatus(404).send("Something went wrong")

  }

})


router.get('/download/:id', async function (req, res, next) {
  try {

    const file = await File.findById(req.params.id)

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
    res.sendStatus(404).end("Error. Not Found")
  
  }
})

router.get('/test', function (req, res, next) {
  sharp(`${UPLOADS_DIR}/Jazz/images-1593197248121-2017-9-27-55826c (1).jpg`)
    .resize({ height: 200 })
    .toFile(`${UPLOADS_DIR}/Jazz/thumb_image.jpg`, (err, info) => { 
      if(err) return console.log(err)
      console.log(info)
      res.end('ok')
    });
    
})

router.post('/new-folder', (req,res)=>{
  //TODO: add Schema Validation
  //TODO: add Auth

  const folder = {
    filePath: req.body.filePath,
    userID: req.body.userID,
    name: req.body.name,
  }
  
  fs.mkdir(getFilePath(folder), { recursive: true }, err =>{
    if (err) console.log(err);
    if (err) return res.status(404).send('There was an error')

    const dbFolder = {
      name: req.body.name,
      userID: req.body.userID,
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
    if (err) return res.status(404).send('There was an error')

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
          // { filePath: {$in: [{}]} }
        ]
      }, callback)
    }
  })

  const callback = (err) => {
    if(err) return res.sendStatus(404).end('Error')
    res.sendStatus(200).end()
  }


})

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


module.exports = router;
