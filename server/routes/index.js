const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
// const {lstatAsync} = require('../middleware/lstatAsync')

const UPLOADS_DIR = path.join(__dirname, '../uploads');

//DB Models
const { File } = require('./../models/file');

// router.get('/files', lstatAsync, function (req, res, next) {

//     res.json(req.filesInfo)

// })

router.post('/files', async function (req, res, next) {

  try {
    const files = await File.find({
      userID: req.body.userID,
      parentFolderID: req.body.parentFolderID
    })

    const folder = (req.body.parentFolderID === "my-drive") ?
      { filePath: [{ name: "My Drive", id: "my-drive"}]}
      :
      await File.findById(req.body.parentFolderID)

    res.send({ files, folder})

  } catch (err) {
    // console.log(err);
    res.sendStatus(404).send("Something went wrong")

  }

})


router.get('/download', function (req, res, next) {
  const filePath = req.query.filePath;

  res.download(`${UPLOADS_DIR}${filePath}`)
})

router.get('/download-folder', function (req, res, next) {
  const filePath = req.query.filePath;
  const fileName = req.query.fileName;

  res.zip({
    files: [
      { path: `${UPLOADS_DIR}${filePath}`, name: fileName }, //can be a file
    ],
    filename: fileName
  });

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


router.post('/upload', (req, res) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${UPLOADS_DIR}${decodeURI(req.query.filePath)}`)
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
    }
  })

  //  File Uploading Middleware - Multiple Images
  const upload = multer({
      storage,
      limits: { fileSize: 1000000 }, // 1000b = 1kb | 1000000b = 1mb
      fileFilter: function (req, file, cb) {
        // console.log(file)

        if (!file) return cb(new Error('No File was sent for uploading'))
        const extName = path.extname(file.originalname);

        if (extName !== '.jpg' && extName !== '.png') {
          return cb(new Error('Only JPG|PNG allowed'))
        }

        cb(null,true)
      }
  }).array('images',10);

  // console.log(upload);
  upload(req, res, function (err) {
    if (err) console.log(err)

    if (err) return res.status(400).end('Ooops, there was an error!');
    
    res.status(200).end();
  })

})

router.post('/new-folder', (req,res)=>{
  //TODO: add Schema Validation
  //TODO: add Auth

// console.log(req.body.filePath);

  const buildFolderPath = req.body.filePath
    .map(path => path.name)
    .filter(name => name !== "My Drive")
    .join('/')

  // console.log('[buildFolderPath]',buildFolderPath);

  let newFolderPath = `${UPLOADS_DIR}/${req.body.userID}`;
  if (buildFolderPath) newFolderPath += `/${buildFolderPath}`
  newFolderPath += `/${req.body.name}`
  
  // console.log(newFolderPath)
  // return res.status(200).end('Folder Created!')

  fs.mkdir(newFolderPath, { recursive: true },(err)=>{

    if (err) console.log(err);
    if (err) return res.status(404).send('There was an error')

    const newFolder = {
      name: req.body.name,
      userID: req.body.userID,
      parentFolderID: req.body.parentFolderID,
      filePath: req.body.filePath,
      isFolder: true
    }

    const folder = new File(newFolder);

    folder.save((err)=>{
      if(err) res.status(404).send('Something went very wrong')

      res.status(200).end('Folder Created!')

    })
  })

})

router.post('/delete', (req, res) => {
  const path = req.body.path;

  fs.lstat(`${UPLOADS_DIR}${path}`, (err, stat) => {
    if (err) console.log(err);

    fs.remove(`${UPLOADS_DIR}${path}`, (err) => {
      if (err) return res.status(404).send('There was an error')

      //file removed
      res.status(200).json({ isDirectory: stat.isDirectory() })
    })

  })

})




module.exports = router;
