const mongoose = require('mongoose')

// Design Candidate Schema:
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },

    // this array store the voted userID so can count the live vote:
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            votedAT: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }
})

// Convert the candidate Schema into 'model' by mongoose and export the model:
const candidate = mongoose.model('candidate', candidateSchema) // 'candidate' this is collection name where store the data in mongoshell:
module.exports = candidate