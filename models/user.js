const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Design user SChema: 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadharaCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
})

// Check if password is Hashed or not if not then hashed the password:
userSchema.pre('save', async function (next) {
    const user = this;

    // Hash the password only if it has been modified (or is new):
    if (!user.isModified('password')) return next();
    try {
        // Hash Password generation:
        const salt = await bcrypt.genSalt(10);

        // Hash Password:
        const hashedPassword = await bcrypt.hash(user.password, salt)

        // Override the plain password with the hashed One:
        user.password = hashedPassword
        next();

    } catch (err) {
        return next(err);
    }
})

// Compare user password for changing password or view profile:
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // Use bcrypt to compare the provided password with the hashed Password:
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    } catch (err) {
        throw err;
    }
}

// Convert the user Schema into model by mongoose and export the model:
const User = mongoose.model('user', userSchema)  // 'user' this is collection name where store the data in mongoshell:
module.exports = User