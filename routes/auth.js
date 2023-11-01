const router = require('express').Router();
const USER = require('../models/USER');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv=require('dotenv')
dotenv.config()

//reggistering new user
router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)
    const data = { ...req.body, 'password': hash }
    const newUser = new USER(data)
    try {
        const user = await newUser.save()
        console.log(user)
        if (!user) {
            res.status(400).send("not created")
            return
        }
        res.status(200).send(user)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

});

//login of a user
router.post('/login', async (req, res) => {

    try {
        const user = await USER.findOne({ email: req.body.email });

        const isCorrect = await bcrypt.compare(req.body.password, user.password)

        if (!isCorrect)
            return res.status(400).json("Incorrect credentials")


        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_KEY);

        const { password, ...others } = user._doc

        res.status(200).send({ ...others, token });



    } catch (error) {
        console.log(error)
        res.status(400).send(error)

    }

});

module.exports = router;