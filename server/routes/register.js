var express = require('express');
var router = express.Router();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//DB Models
const { User } = require('./../models/user');


router.post('/', function (req, res, next) {
    if (Object.entries(req.body).length === 0) return res.status(400).end('No Info Sent for Registration')

    const user = new User(req.body);

    User.findOne({
        $or: [
            { email: req.body.email },
            { username: req.body.username }
        ]
    }).exec(function (err, userDoc) {
        // if(err) console.log(err)
        if (err) return res.status(404).end('There was an error processing with your request')

        if (userDoc && (userDoc.email === req.body.email)) return res.status(403).end( "Email is already in use") 
        if (userDoc && (userDoc.username === req.body.username)) return res.status(403).end( "Username is already in use") 

        //TODO: You need to provide a way to validate required fields before processing your request
        user.genRefreshToken((err, user, refreshToken, accessToken) => {
            //TODO: You need to add validation for all required fields
            // if (err) console.log(err.errors)
            if (err) return res.status(404).end('There was an error processing with your request');

            const hostname = (process.env.NODE_ENV === 'production' ? req.hostname : `http://localhost:${process.env.PORT}`)

            //TODO: You need to configure how the link on your emails will look
            const msg = {
                to: `${user.email}`,
                from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL} >`,
                subject: 'Verify your Email',
                text: `Hi ${user.firstname}, Please use this link to verify your email address: ${hostname}/verify-account/${user.email}/${refreshToken}`,
                html: `
                Hi ${user.firstname}, Please use this link to verify your email address:
                <br><br>
                ${hostname}/verify-account/${user.email}/${refreshToken}
            `,
            };
            //ES6
            sgMail
                .send(msg)
                .then(() => {
                    // console.log("Message sent!");
                }, error => {
                    //TODO: Email was not sent. Handle this error
                    // console.error(error);

                    // if (error.response) return console.error(error.response.body)

                });


            res
                .cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 24 * 3600000) })
                .cookie('accessToken', accessToken, { expires: new Date(Date.now() + (60 * 10000)) })
                .status(200)
                .end();
        })
    });

});

module.exports = router;
