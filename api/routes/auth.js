const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
        ).toString(),
    });

    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});
// Login
router.post("/login", (req, res) => {
    try {
        const user = User.findOne({ email: req.body.email });
        !user && res.status(401).json("Wrong username or password.")

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password &&
            res.status(401).json("Wrong password or username.");

        const acessToken = jwt.sign(
            { id: user._id, idAdmin: user.isAdmin },
            process.env.SECRET_KEY, { expiresIn: "5d" }
        );

        const { password, ...info } = user._doc;

        res.status(200).json(...info, access_token);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;