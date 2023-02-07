const moment = require('moment')
const jwt = require('jsonwebtoken')

const utility = {}

const generateToken = (userId, expires, secret = process.env.JWT_SECRET) => {
    const payload = {
        userId: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        secret
    }
    return jwt.sign(payload, secret)
}

utility.generateAuthToken = async (user) => {
    const accessTokenExpires = moment().add(
        process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        'minutes'
    )
    const accessToken = generateToken(user.id, accessTokenExpires)
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        }
    }
}

utility.formatMessage = (username, text) => {
    return {
        username, 
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = utility