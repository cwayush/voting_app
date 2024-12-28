const express = require('express');
const router = express.Router();
const User = require('./../models/user')
const { jwtAthMiddle, generationToken } = require('./../jwt')

// Signup the new user data:
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
        res.status(201).json({ response: response, token: token });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error!' })

    }
})

// Login the user and generate new token after expiring token:
router.post('/login', async (req, res) => {
    try {
        const { aadharaCardNumber, password } = req.body;
        const user = await User.findOne({ aadharaCardNumber: aadharaCardNumber })
        // Compare user aadharCardNumber and his/her password:
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid AadharNumber or Password" });
        }

        // IF user exist then generate new token:
        const payload = {
            id: User.id
        }
        const token = generationToken(payload)
        res.json({ token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error!' })
    }
})

// Get user profile through userID:
router.get('/profile', jwtAthMiddle, async (req, res) => {
    try {
        const UserData = req.user;
        console.log("userData is:", UserData)

        const userId = UserData.id;
        const user = await User.findById(userId)
        res.status(200).json({ user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error!" })
    }
})

// Update user password using old_password:
router.put('/profile/password', jwtAthMiddle, async (req, res) => {
    try {
        const userID = req.user.id
        const { currentPassword, newPassword } = req.body;

        const user = User.findById(userID)
        if (!await user.comparePassword(currentPassword)) {
            res.status(400).json({ error: 'Invalid Password!' })
        }
        user.password = newPassword
        await user.save();

        console.log('Password Updated')
        res.status(200).json({ massage: 'Password Updated!' })

    } catch (err) {
        console.log(err)
        req.status(500).json({ error: 'Internal server Error' })
    }
})

// Export router:
module.exports = router