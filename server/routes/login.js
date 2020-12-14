var express = require('express');
var router = express.Router();
const jwtDecode = require("jwt-decode");

//DB Models
const { User } = require('./../models/user');

router.post('/', async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).exec();

      if (!user) {
        return res.status(403).json({
          message: "Wrong email or password.",
        });
      }

      const passwordValid = await user.comparePassword(password);

      if (passwordValid) {
        const { firstname, lastname, email } = user;
        const userInfo = { firstname, lastname, email };

        const token = user.genAccessToken();

        const decodedToken = jwtDecode(token);
        const expiresAt = decodedToken.exp;

        res.cookie("accessToken", token, {
          httpOnly: true,
        });

        res.json({
          message: "Login successful!",
          token,
          userInfo,
          expiresAt,
        });
      } else {
        res.status(403).json({
          message: "Wrong email or password.",
        });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: "Something went wrong. Try to log in again." });
    }

});

module.exports = router;
