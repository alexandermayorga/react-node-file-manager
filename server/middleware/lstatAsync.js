const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const lstatPromise = util.promisify(fs.lstat);
const UPLOADS_DIR = path.join(__dirname, '../uploads');

const lstatAsync = (req, res, next) => {
    if (req.query.directory) console.log(req.query.directory)
    const directory = (req.query.directory ? `${UPLOADS_DIR}/${decodeURI(req.query.directory)}` : UPLOADS_DIR)

    fs.readdir(directory, (err, files) => {
        // if (err) console.log(err)
        if (err) return next()

        files = files.filter(item => !(/(^|\/)\.[^/.]/g).test(item)); //No Hidden files

        Promise
            .all(files.map(async (file) => {

                const stat = await lstatPromise(`${directory}/${file}`)

                // console.log(stat)

                if (stat.size < 1000000) stat.size = `${Math.floor(stat.size / 1000)}kb`;
                if (stat.size >= 1000000) stat.size = `${Math.floor(stat.size / 1000000)}mb`;

                const fileInfo = {
                    fileName: file,
                    size: stat.isDirectory() ? null : stat.size,
                    filePath: `${req.query.directory}${file}`,
                    ext: path.extname(file) || null,
                    isDirectory: stat.isDirectory(),
                    parentDir: req.query.directory
                }
                return fileInfo;

            }))
            .then((filesInfo) => {
                req.filesInfo = filesInfo;
                next()
            }).catch(err => {
                next()
            })

    });

}


module.exports = { lstatAsync }