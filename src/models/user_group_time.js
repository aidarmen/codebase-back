const mongoose = require('mongoose')

const UserGroupTimeSchema = new mongoose.Schema({
	time_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'group_time'
    },
    group_user_id:{
        type: mongoose.Schema.ObjectId,
		ref: 'user_group'
    },
    status:{
        type: Boolean,
		default: false
    }
})

module.exports = mongoose.model('user_group_time', UserGroupTimeSchema)
