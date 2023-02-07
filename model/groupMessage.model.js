const mongoose = require('mongoose')

const groupMessageSchema = mongoose.Schema({
    from_user: {
        type: String,
        required: true
    },
    room: {
        type: String,
        trim: true,
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    date_sent: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const GroupMessage = mongoose.model('groupMessage', groupMessageSchema)

module.exports = GroupMessage
