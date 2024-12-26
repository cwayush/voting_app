const jwt = require('jsonwebtoken')

// Export the data like Id and username etc from Token 
// Check this userID user present or not in collection 
// If present then print the all details of user:
const jwtAthMiddle = (req, res, next) => {
    const authorization = req.headers.authorization
    if (!authorization) return res.status(401).json({ error: 'Token NOt Found!' })

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded
        next();

    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Invalid Token!' })
    }
}

// Generate the token if user is new:
const generationToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET)
}

module.exports = { jwtAthMiddle, generationToken }