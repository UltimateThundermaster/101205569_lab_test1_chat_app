const httpStatus = require('http-status')
const { User } = require('../model')
const utility = require('../utils/utility')

const signupForm = async (req, res) => {
    res.render('register', {title: 'Sign Up', username: ''})
}

const signup = async (req, res) => {
    const {username, firstname, lastname, password} = req.body
    try {
        if(!username || !firstname || !lastname || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({message: "All fields are required"})
        }
        if(await User.isUserNameTaken(username)) {
            return res.status(httpStatus.BAD_REQUEST).json({message: "Username Already Taken"})
        }
        const user = await User.create(req.body)
        if(!user) {
            return res.status(httpStatus.BAD_REQUEST).json({message: "Bad Request"})
        }
        res.status(httpStatus.OK).json({message: "Account created successfully"})
    }catch(err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}

const getSigninForm = async (req, res) => {
    res.render('login', {title: 'Sign In', username: ''})
}

const signin = async (req, res) => {
    const {username, password} = req.body
    try {
        const user = await User.findOne({username})
        if(!user || !(await user.isPasswordMatch(password))) {
            return res.status(httpStatus.BAD_REQUEST).json({message: "Bad Credentials"})
        }
        const token = await utility.generateAuthToken(user)
        res.status(httpStatus.OK).json ({
            user, token
        })
    }catch(err) {
        console.log(err.message)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}

module.exports = {
    getSigninForm,
    signupForm,
    signup,
    signin
}