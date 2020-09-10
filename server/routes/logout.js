var express = require('express');
var router = express.Router();

//DB Models
const { User } = require('./../models/user');

// @route  POST /api/logout
// @desc Logout User, Deletes Token Cookies and Token in DB
// @access PRIVATE
router.post('/', function (req, res, next) {

    //TODO: you decide what to do after logout
    
    if (!req.cookies.refreshToken) return res.send("You have logged out!")

    User.deleteTokens(req.cookies.refreshToken, (err) => {
        if (err) res.status(400).json({ message: "Bad Request", err });

        res
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .send("You have logged out!")
    })
    
});

module.exports = router;
