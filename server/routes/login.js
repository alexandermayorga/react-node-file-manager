var express = require('express');
var router = express.Router();

//DB Models
const { User } = require('./../models/user');

router.post('/', function (req, res, next) {
    const badRequest = 'There was an error with your request. Please check your information and try again.';

    if (Object.entries(req.body).length === 0 || !req.body.email) return res.status(400).send('No info was sent for Authorization')

    //Query the database
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (err) return res.status(400).end(badRequest)
        
        if (!user) return res.status(400).end('Auth Failed. No User found with that email.');

        //Check if password match
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (err) return res.status(400).end(badRequest)
            
            if (!isMatch) return res.status(401).end('Wrong password.')
            

            user.genRefreshToken((err, user, refreshToken, accessToken) => {
                if (err) res.status(400).end(badRequest)

                //TODO: You must decide how you want to handle successful logins. 
                res
                    .cookie('refreshToken', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 24 * 3600000) })
                    .cookie('accessToken', accessToken, { httpOnly: true, expires: new Date(Date.now() + (60 * 15000)) })
                    .status(200)
                    .end('Logged In!');
                
            })
        })
    })


});

module.exports = router;
