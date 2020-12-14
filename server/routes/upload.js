const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

//DB Models
const { File } = require('./../models/file');

router.post('/', (req, res) => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `${UPLOADS_DIR}/tmp`)
        },
        filename: function (req, file, cb) {
            // cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
            cb(null, file.originalname)
        }
    })

    //  File Uploading Middleware - Multiple Images
    const upload = multer({
        storage,
        limits: { fileSize: 1000000 }, // 1000b = 1kb | 1000000b = 1mb
        fileFilter: function (req, file, cb) {
            if (!file) return cb(new Error('No File was sent for uploading'))
            const extName = path.extname(file.originalname);

            if (
              extName !== ".jpg" &&
              extName !== ".png" &&
              extName !== ".jpeg"
            ) {
              // console.log('Extension Error')
              return cb(new Error("Only JPG|PNG allowed"));
            }
            cb(null, true)
        }
    }).array('images', 10);

    upload(req, res, function (err) {

        if (err) console.log(err)
        if (err) return res.status(400).end('Ooops, there was an error!');

        const filePath = JSON.parse(req.body.filePath).filePath
        const buildFolderPath = filePath
            .map(path => path.name)
            .filter(name => name !== "My Drive")
            .join('/')

        let newFilePath = `${UPLOADS_DIR}/${req.user.sub}`;
        if (buildFolderPath) newFilePath += `/${buildFolderPath}`

        const promises = req.files.map(file => {
            return fs.rename(file.path, `${newFilePath}/${file.originalname}`)
        })

        Promise.all(promises)
            .then(() => {
                const newFiles = req.files.map(file => {
                    return {
                        name: file.originalname,
                        userID: req.user.sub,
                        parentFolderID: req.body.parentFolderID,
                        size: file.size,
                        filePath,
                        isFolder: false
                    }
                })

                const dbPromises = newFiles.map(file => {
                    const newFile = new File(file);
                    return newFile.save()
                })

                //Database Saving Promise
                Promise.all(dbPromises)
                    .then(() => res.status(200).end())
                    .catch(err => res.status(404).end('Something went very wrong'))

            })// Move Files Promise
            .catch(err => {
                console.log(err)
                res.status(404).send('Something went very wrong')
            })// Move Files Promise

    })

})

module.exports = router;