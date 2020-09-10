var express = require('express');
var router = express.Router();

// @route  POST /api/user
// @desc Authenticate User
// @access PUBLIC
router.post('/', function (req, res, next) {

    if (!req.user) return res.status(401).end('You need to be logged in');

    const user = {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email, 
        firstname: req.user.firstname, 
        lastname: req.user.lastname
    }

    res.status(200).json(user)


});

module.exports = router;
