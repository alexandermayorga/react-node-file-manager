const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const fsPromises = require("fs").promises;
const path = require('path');
const multer = require('multer');
const UPLOADS_DIR = path.join(__dirname, './../uploads');


//DB Models
const { File } = require('./../models/file');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    if (!req.user.sub || !req.body.filePath)
        return res.status(400).json({ message: "Bad Request!" });

    let destinationFolderPath = `${UPLOADS_DIR}/${req.user.sub}`;

    const { filePath } = JSON.parse(req.body.filePath);
    const buildFolderPath = filePath
        .map((path) => path.name)
        .filter((name) => name !== "My Drive")
        .join("/");

    if (buildFolderPath) destinationFolderPath += `/${buildFolderPath}`;

    // console.log(destinationFolderPath);

    fsPromises
        .lstat(destinationFolderPath)
        .then((stat) => {
        //Folder Exists
        console.log("[Folder Exists]");
        cb(null, destinationFolderPath);
        })
        .catch(async (err) => {
        try {
            if (err.code === "ENOENT") {
            // Folder does not exist

            // console.log("[Folder Does Not Exists - Create it]");
            const newUserFolder = await fsPromises.mkdir(
                destinationFolderPath,
                {
                recursive: true,
                }
            );

            cb(null, destinationFolderPath);
            } else {
            console.log("Error Checking Folder Status:", err.code);
            cb(new Error("Error Checking Folder Status"));
            }
        } catch (error) {
            console.log("Error Creating new Folder Recursively:", error);
            cb(new Error("Error Creating new Folder Recursively:"));
        }
        });
    },
    filename: function (req, file, cb) {
    // cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
    cb(null, file.originalname);
    },
});

//  File Uploading Middleware - Multiple Images
const upload = multer({
    storage,
    limits: { fileSize: 1000000 }, // 1000b = 1kb | 1000000b = 1mb
    fileFilter: function (req, file, cb) {
    if (!file) return cb(new Error("No File was sent for uploading"));
    const extName = path.extname(file.originalname);

    if (extName !== ".jpg" && extName !== ".png" && extName !== ".jpeg") {
        // console.log('Extension Error')
        return cb(new Error("Only JPG|PNG allowed"));
    }
    cb(null, true);
    },
}).array("images", 10);


router.post('/', (req, res) => {

    upload(req, res, function (err) {

        if (err) console.log(err)
        if (err) return res.status(400).end('Ooops, there was an error!');

        const filePath = JSON.parse(req.body.filePath).filePath

        const newFiles = req.files.map((file) => {
            return {
              name: file.originalname,
              userID: req.user.sub,
              parentFolderID: req.body.parentFolderID,
              size: file.size,
              filePath,
              isFolder: false,
            };
        });

        const dbPromises = newFiles.map((file) => {
            const newFile = new File(file);
            return newFile.save();
        });

        //Database Saving Promise
        Promise.all(dbPromises)
          .then((files) => {
            // console.log(files);
            return res.json({ message: "Uploaded Succesfully!", files });
          })
          .catch((err) =>
            res
              .status(400)
              .json({ message: "Something went very wrong", theError: err })
          );

    })

})

module.exports = router;