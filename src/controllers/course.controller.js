const COURSES = require('../models/course')
const GROUPS = require('../models/group')
const USER_GROUP = require('../models/user_group')
const Config = require('../config/config')
const mongoose = require('mongoose')



function get_courses(req, res) {
    GROUPS.aggregate([
        { $match: { 'teacher_id': mongoose.Types.ObjectId(req.user._id) } },
        {
            $lookup: {
                from: 'courses',
                localField: 'course_id',
                foreignField: '_id',
                as: 'course'
            }
        },
        {
            $group: {
                _id: {
                    "course_id": "$course._id",
                    "course_name": "$course.course_name"
                }
            }
        }
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            
            res.status(200).send(result).end()
        
        }
    })
}

function get_all_courses(req, res) {
    COURSES.find({}, (err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })
}

function create_courses(req, res) {
   
    let newCourse = new COURSES({
        course_name: req.body.course_name,
        course_img: req.body.course_img

    })
    newCourse.save((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })

}

function get_stud_course(req, res) {
 
    USER_GROUP.aggregate([
        { $match: { 'user_id': mongoose.Types.ObjectId(req.user._id) }},
        {
            $lookup: {
                from: 'groups',
                localField: 'group_id',
                foreignField: '_id',
                as: 'studGroup'
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'studGroup.course_id',
                foreignField: '_id',
                as: 'studCourses'
            } 
        },
        {
            $group: {
                _id: {
                    "course_id": "$studCourses._id",
                    "course_name": "$studCourses.course_name",
                    "course_img": "$studCourses.course_img",
                    "group_id":"$studGroup._id"
                }
            }
        }

    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
          
        }
    })
}






module.exports = {
    get_stud_course,
    get_courses,
    get_all_courses,
    create_courses
}