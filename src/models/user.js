const mongoose = require('mongoose')

// Gender: 0 - woman, 1 - man
// Role: 0 - student , 1 - teacher , 2 - admin

const UserSchema = new mongoose.Schema({
    password: {
        type: String,
        require: true
    },
    role: {
        type: Number,
        require: true,
        default: 0
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        default: null
    },
    surname: {
        type: String,
        default: null
    },
    photo_url: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('user', UserSchema)