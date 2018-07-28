const mongoose = require('mongoose')


const CourseSchema = new mongoose.Schema({
    course_name: {
			type: String,
			require: true,
			unique: true
    },
    course_img: {
			type: String,
			default: ''
	}
})

module.exports = mongoose.model('course', CourseSchema)
