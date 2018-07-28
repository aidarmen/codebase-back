const mongoose = require('mongoose')

const HomeWorkSchema = new mongoose.Schema({
    group_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'homework'
    },
    lesson: {
        type: String,
        require: true
    },
    actual_date: {
        type: String,
        require: true
    },
    home_task: {
        type: String,
        require: true
    },
    date: {
        type: Date
    },
    course_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'course'
    }
})

module.exports = mongoose.model('home_work', HomeWorkSchema)