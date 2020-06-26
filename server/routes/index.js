const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const {lstatAsync} = require('../middleware/lstatAsync')

const UPLOADS_DIR = path.join(__dirname, '../uploads');


router.get('/files', lstatAsync, function (req, res, next) {

    res.json(req.filesInfo)

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
  
  fs.mkdir(`${UPLOADS_DIR}${req.body.newFolderName}`,(err)=>{

    if (err) console.log(err);
    if (err) return res.status(404).send('There was an error')
    res.status(200).end()
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
