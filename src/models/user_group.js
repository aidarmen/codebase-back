const mongoose = require('mongoose')

const UserGroup = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    group_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'group'
    },
    payment_status: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('user_group', UserGroup)