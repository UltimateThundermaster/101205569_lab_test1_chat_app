const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true
    },
    firstname: {
        type: String,
        trim: true,
        required: true,
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    createon: {
        type: Date,
        default: Date.now()
    }
})

userSchema.statics.isUserNameTaken = async function(username) {
    const user = await this.findOne({username})
    return user
}

userSchema.methods.isPasswordMatch = async function(password) {
    const user = this
    return bcrypt.compare(password, user.password)
}

userSchema.pre('save', async function(next) {
   const user = this
   if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
   }
})

const User = mongoose.model('user', userSchema)

module.exports = User