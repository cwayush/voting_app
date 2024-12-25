const express = require('express');
const router = express.Router();
const { default: mongoose } = require('mongoose');
const User = require('./../models/user')
const { jwtAthMiddle, generationToken } = require('./../jwt')

router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('Person_data Saved On server')

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload))
        const token = generationToken(payload)
        console.log('Token is:', token)
        res.status(200).json({ response: response, token: token });

    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Internal Server Error!' })

    }
})

router.post('/login', async (req, res) => {
    try {
        const { aadharaCardNumber, password } = req.body;
        const user = await User.findOne({ aadharaCardNumber, aadharaCardNumber })
        if (!user || !await User.comparePassword(password)); {
            res.status(401).josn({ error: "Invalid AadharNumber or Password" });

        }
        const payload = {
            id: User.id
        }
        const token = generationToken(payload)
        res.json({ token })
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Internal Server Error!' })
    }
})
router.get('/profile', jwtAthMiddle, async (req, res) => {
    try {
        const UserData = req.user;
        console.log("userData is:", UserData)

        const userId = userData.id;
        const user = await User.findById(userId)
        res.status(200).json({ user })
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: "Internal server error!" })
    }
})

router.put('/profile/password', jwtAthMiddle, async (req, res) => {
    try {
        const userID = req.user.id
        const { currentPassword, newPassword } = req.body;

        const user = User.findById(userID)
        if (!await user.comparePassword(currentPassword)) {
            res.status(401).json({ error: 'Invalid Password!' })
        }
        user.password = newPassword
        await user.save();

        console.log('Password Updated')
        res.status(200).json({ massage: 'Password Updated!' })

    } catch (err) {
        console.log(err)
        req.status(401).json({ error: 'Internal server Error' })
    }
})

module.exports = router