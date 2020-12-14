var express = require('express');
var router = express.Router();

// @route  POST /api/logout
// @desc Logout User, Deletes Token Cookies and Token in DB
// @access PRIVATE
router.get('/', function (req, res, next) {

    //TODO: you decide what to do after logout    
    return res
      .clearCookie("accessToken")
      .json({ message: "You have logged out!" });
    
});

module.exports = router;
