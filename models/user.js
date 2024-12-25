const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
        default: true
    }
})

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

userSchema.method.comparePassword = async function (candidatePassword) {
    try {
        // Use bcrypt to compare the provided password with the hashed Password:
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        isMatch
    } catch (err) {
        throw err;
    }
}

const User = mongoose.model('user', userSchema)
module.exports = User