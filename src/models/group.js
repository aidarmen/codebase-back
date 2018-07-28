const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
    course_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'course'
    },
    teacher_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'

    },
    group_name: {
        type: String,
        require: true
    },
    startDate: {
        type: Date,
        require: true
    },
    duration: {
        type: Number,
        default: 0
    },
    lessonDays: {
        type: [],
        default: new Array(7).fill(false),

    },
    startTime: {
        type: Date,
        require: true
    },
    endTime: {
        type: Date,
        require: true
    }
})

module.exports = mongoose.model('group', GroupSchema)