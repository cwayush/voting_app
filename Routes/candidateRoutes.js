const express = require('express')
const router = express.Router();
const { defaut, mongoose } = require('mongoose');
const candidate = require('./../models/candidate')
const User = require('./../models/user')

const { jwtAthMiddle, generationToken } = require('./../jwt');

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
        const candidateID = req.params.candidateID;
        const updateCandData = req.body

        // Find candidate by candidateID and Updatecandidate data:
        const response = await candidate.findByIdAndUpdate(candidateID, updateCandData, {
            new: true,
            runValidators: true
        })
        if (!response) {
            return res.status(404).json({ error: 'Candidate Not Found' })
        }
        console.log('Candidate data Updated')
        res.status(200).json(response)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server error' })

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

router.post('/vote/:candidateID', jwtAthMiddle, async (req, res) => {
    try {
        const candidateID = req.params.candidateID;
        const userID = req.user.id;

        // Find the candidate document with the specified candidate:
        const Candidate = await candidate.findById(candidateID)
        if (!Candidate) {
            return res.status(404).json({ error: "Candidate not Found" })
        }
        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ error: "User not Found" })
        }
        if (user.isVoted) {
            return res.status(400).json({ error: "User already Voted" })
        }
        if (user.role == 'admin') {
            return res.status(403).json({ error: "Admin don't give vote" })
        }

        // Update the candidate document to record the vote:
        Candidate.votes.push({ user: userID })
        Candidate.voteCount++;
        await Candidate.save();

        // Update the user document 
        user.isVoted = true
        await user.save();

        res.status(200).json({ message: 'Vote recorded successfully' })
    } catch (err) {
        console.log(err)
        res.status(200).json({ error: 'Internal Server error' })
    }
})

// Vote Count
router.get('/vote/count', async (req, res) => {
    try {
        // Find all candidate and sort them by voteCount in descending order:
        const Candidate = await candidate.find().sort({ voteCount: 'desc' })

        // Map the candidate to only return their name and voteCount:
        const voteRecord = Candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord)
    } catch (err) {
        console.log(err)
        res.status(200).json({ error: 'Internal Server error' })

    }
})

// Export router
module.exports = router