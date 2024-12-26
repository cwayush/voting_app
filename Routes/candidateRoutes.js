const express = require('express')
const router = express.Router();
const { defaut, mongoose } = require('mongoose');
const candidate = require('./../models/candidate')
const User = require('./../models/user')

const { jwtAthMiddle, generationToken } = require('./../jwt')

// Check that the user role is admin or not: Reason only admin can register and update the candidates data: 
const admincheckrole = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user.role == 'admin'
    } catch (err) {
        return false;
    }
}

// Check if user is admin then register the candidates:
router.post('/', jwtAthMiddle, async (req, res) => {
    try {
        if (!await admincheckrole(req.user.id))
            return res.status(403).json({ message: 'Admin role not Found!' })

        const data = req.body;
        const newCandidate = new candidate(data);
        const response = await newCandidate.save();
        res.status(200).json({ response: response })
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Internal Serever Data' })

    }
})

// Check if user is admin then update the candidates data:
router.put('/:candidateID', jwtAthMiddle, async (req, res) => {
    try {
        if (!await admincheckrole(req.user.id))
            return res.status(403).json({ message: 'user does not have admin role' })
        const candidateID = req.params.id;
        const updateCandData = req.body

        // Find candidate by candidateID and Updatecandidate data:
        const response = await candidate.findByIdAndUpdate(candidateID, updateCandData, {
            new: true,
            runValidators: true
        })
        if (!response) {
            res.status(403).json({ error: 'Candidate Not Found' })
        }
        console.log('Candidate data Updated')
        res.status(200).json(response)

    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Internal Server error' })

    }
})

// Check if user is admin then delete the candidate data:
router.delete('/:candidateID', jwtAthMiddle, async (req, res) => {
    try {
        if (!await admincheckrole(req.user.id))
            return res.status(403).json({ message: 'user does not have admin role' })
        const candidateID = req.params.id;

        // Find Candidate by candidateID and Delete them:
        const response = await candidate.findByIdAndDelete(candidateID)
        if (!response) {
            res.status(403).json({ error: 'Candidate Not Found' })
        }
        console.log('Candidate Data Deleted')
        res.status(200).json(response)
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Internal Server error' })

    }
})

// Export router
module.exports = router