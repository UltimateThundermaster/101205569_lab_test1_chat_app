const httpStatus = require('http-status')
const { User, GroupMessage } = require('../model')

const dashboard = async (req, res) => {
    try{
        const users = await User.find({_id: {$ne: req.user.userId}})
        res.render('dashboard', {title: "Dashboard", users, username: ''})   
    }catch(err) {
        res.status(httpStatus.SERVICE_UNAVAILABLE).json({err})
    }
} 

const groupChat = async (req, res) => {
    try {
        const room = req.query.room
        const messages = await GroupMessage.find({room}).sort({createdAt: -1})
        res.render('groupChat', {title: room, messages})
    }catch(err) {
        res.status(httpStatus.SERVICE_UNAVAILABLE).json({ err })
    }
}

module.exports = {
    dashboard,
    groupChat
}