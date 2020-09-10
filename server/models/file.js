const mongoose = require('mongoose');

//DB Schema
const fileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    userID: {
        type: String,
        required: true,
    },
    parentFolderID: {
        type: String,
        required: true,
    },
    filePath: {
        type: [Object],
        required: true,
        minlength: 1
    },
    size: {
        type: Number,
        default: 0
    },
    // thumbPath: {
    //     type: String,
    // },
    isFolder: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });


const File = mongoose.model('File', fileSchema);

//Export the model
module.exports = { File }