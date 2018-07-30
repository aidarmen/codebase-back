const mongoose = require('mongoose')
const GROUPS = require('../models/group')
const USERS = require('../models/user')
const USER_GROUP = require('../models/user_group')
const GROUP_TIME = require('../models/group_time')
const USER_GROUP_TIME = require('../models/user_group_time')
const HOME_WORK = require('../models/home_work')

const Config = require('../config/config')


function homework(req, res) {
  
    HOME_WORK.aggregate([
        { $match: { 'group_id': mongoose.Types.ObjectId(req.body.group_id) } },
    ])
    let home_work = new HOME_WORK({
        group_id: mongoose.Types.ObjectId(req.body.group_id),
        lesson: req.body.lesson,
        home_task: req.body.home_task,
        date: req.body.date
    })
    home_work.save((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })
}

function get_homework(req, res) {
 
    HOME_WORK.aggregate([
        { $match: { 'group_id': mongoose.Types.ObjectId(req.params.group_id) } },
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
         
            res.status(200).send(result).end()
        }
    })
   
}


function create_group(req, res) {
    if (req.user.role == 1) {
        let newGroup = new GROUPS({
            course_id: req.body.course_id,
            teacher_id: req.user._id,
            group_name: req.body.group_name,
            duration: req.body.duration,
            lessonDays: req.body.lessonDays,
            startDate: new Date(req.body.startDate),
            startTime: new Date(req.body.startTime),
            endTime: new Date(req.body.endTime)
        })
        newGroup.save((err, result) => {
            if (err) throw new Error(err)
            else {
                let time = new Date(req.body.startDate);
                var weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
                var dayInMilliseconds = 24 * 60 * 60 * 1000;


                for (let i = 0; i < 7; i++) {
                    if (result.lessonDays[i]) {
                        var LocalTime = new Date(time)
                        LocalTime.setTime(LocalTime.getTime() - weekInMilliseconds + dayInMilliseconds * i)
                        for (let j = 0; j < result.duration; j++) {
                            let timeItem = new Date(LocalTime.setTime(LocalTime.getTime() + weekInMilliseconds))
                            timeItem.setHours(new Date(result.startTime).getHours())
                            timeItem.setMinutes(new Date(result.startTime).getMinutes())

                            var startDate = new Date(timeItem)
                            timeItem.setHours(new Date(result.endTime).getHours())
                            timeItem.setMinutes(new Date(result.endTime).getMinutes())
                            var endTime = new Date(timeItem)



                            let newGroupTime = new GROUP_TIME({
                                group_id: result._id,
                                startDate: startDate,
                                endDate: endTime
                            })


                            newGroupTime.save((err, group_time) => {
                                if (err) throw new Error(err)
                                else {
                                 
                                }
                            })
                        }
                    }
                }
                res.status(200).send(result).end()
            }
        })
    } else {
        res.status(400).send({
            'error': 'Только учитель может создать новую группу'
        }).end()

    }
}

function get_user_groups(req, res) {
    GROUPS.aggregate([
        { $match: { 'teacher_id': mongoose.Types.ObjectId(req.user._id) } },
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })
}

function get_course_groups(req, res) {
    GROUPS.aggregate([
        { $match: { 'course_id': mongoose.Types.ObjectId(req.params.course_id) } },
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })
}

function get_group_name(req, res) {
    GROUPS.aggregate([
        { $match: { '_id': mongoose.Types.ObjectId(req.params.group_id) } },
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })
}

async function add_user_to_group(req, res) {
    if (req.user.role == 1) {

        GROUPS.aggregate([{
            $match: {
                'teacher_id': mongoose.Types.ObjectId(req.user._id),
                '_id': mongoose.Types.ObjectId(req.body.group_id),
            }
        }, ]).exec((err, result) => {
            if (err || result.length == 0 || !req.body.student_id) {
                res.status(400).send({
                    'error': 'Неправильные данные'
                }).end()
            } else {
                USERS.findOne({ _id: mongoose.Types.ObjectId(req.body.student_id) }, (err, student) => {
                    if (err) {
                        res.status(400).send({
                            'error': 'Не можем найти студента с таким id'
                        }).end()

                    } else {
                        USER_GROUP.find({ user_id: mongoose.Types.ObjectId(student._id), group_id: mongoose.Types.ObjectId(req.body.group_id) }, (err, data) => {
                            if (err) throw new Error(err);
                            if (data && data.length > 0) {

                                res.status(400).send({ data: 'user uzheest' }).end()
                                return;
                            } else {
                                let newUserGroup = new USER_GROUP({
                                    user_id: mongoose.Types.ObjectId(student._id),
                                    group_id: mongoose.Types.ObjectId(req.body.group_id)
                                })
                                newUserGroup.save((err, newUserGroup) => {
                                    if (err) throw new Error(err)
                                    else {
                                        GROUP_TIME.find({
                                            group_id: mongoose.Types.ObjectId(req.body.group_id)
                                        }, (err, group_time) => {
                                          
                                            var array = group_time.map(async(value, index) => {


                                                let newUserGroupTime = new USER_GROUP_TIME({
                                                    time_id: mongoose.Types.ObjectId(value._id),
                                                    group_user_id: mongoose.Types.ObjectId(newUserGroup._id)
                                                })
                                                let qq = await newUserGroupTime.save()
                                                return qq;

                                            })
                                            res.send({ data: array }).end()
                                        })
                                    }

                                })
                            }
                        })

                    }
                })


            }
        })
    } else {
        res.status(400).send({
            'error': 'Только учитель может добавить нового ученика в группу'
        }).end()

    }

}

function delete_user_in_group(req, res) {
    GROUPS.findOne({
            'teacher_id': req.user._id,
            '_id': req.body.group_id
        }, (err, group) => {
            if (err) throw new Error(err)
            USER_GROUP.deleteOne({ user_id: req.body.student_id, group_id: group._id }, (err, user_group_item) => {
                if (err) throw new Error(err)
                USER_GROUP_TIME.deleteMany({ group_user_id: user_group_item._id }, (errr, r) => {
                    if (errr) throw new Error(errr)
                    res.send(r)
                })

            })

        })
        // USER_GROUP.deleteOne({})

}


function get_group_time(req, res) { 
  
    GROUP_TIME.aggregate([{
            $match: {
                group_id: mongoose.Types.ObjectId(req.params.group_id)
            }
        },
        {
            $sort: {
                startDate: 1
            }
        }
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
            // console.log(result)
        }
    })

}

function get_time(text) {


}
// function get_group_time(req,res){
//     GROUP_TIME.aggregate([
// 		{
// 	  		$match: {
//                 group_id: mongoose.Types.ObjectId(req.params.group_id)
// 	  		}
// 		},
// 		{
// 			$sort: {
// 				startDate: 1
// 			}
// 		}
// 	]).exec((err, result) => {
// 		if(err) throw new Error(err)
// 		else {
//             res.status(200).send(result).end()
//         }
//     })
// }
function get_users_in_group(req, res) {
    USER_GROUP.aggregate([{
            $match: {
                group_id: mongoose.Types.ObjectId(req.params.group_id)
            }
        },
        {
            $lookup: {
                from: 'user_group_times',
                localField: '_id',
                foreignField: 'group_user_id',
                as: 'time'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_info'
            }
        }
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            result.map((value, index) => {
                if (value['time']) {
                    value['time'].map((time, id) => {
                        GROUP_TIME.findOne({ _id: mongoose.Types.ObjectId(value['time'][id]['time_id']) }, (err, group_item) => {
                         
                            result[index]['time'][id]['aa'] = group_item
                        })


                    })
                }
            })
            res.status(200).send(result).end()
        }
    })

}


function mark_student_paid(req, res) {

USER_GROUP.update(
        {'group_id': mongoose.Types.ObjectId(req.body.group_id),
        '_id': mongoose.Types.ObjectId(req.body.student_id)},
        { $set:
           
            { 'payment_status': true}
           
        },(err,item)=>{
            console.log(item)
            res.status(200).send(item).end()
        }
    ); 

}

function mark_student_notpaid(req, res) {

    USER_GROUP.update(
            {'group_id': mongoose.Types.ObjectId(req.body.group_id),
            '_id': mongoose.Types.ObjectId(req.body.student_id)},
            { $set:
               
                { 'payment_status': false}
               
            },(err,item)=>{
                if (err) console.log(err) 
                else {
                console.log(item)}
                res.status(200).send(item).end()
            }
        );  
 }



 async function attendance_true(req, res) {
    try{
        // let user_group = await USER_GROUP.find({group_id: mongoose.Types.ObjectId(req.body.group_id), user_id: mongoose.Types.ObjectId(req.body.user_id)});

      

        USER_GROUP_TIME.update(
            {'group_user_id': mongoose.Types.ObjectId(req.body.group_user_id),
            'time_id': mongoose.Types.ObjectId(req.body.time_id)},
                { $set:
                       
                        { 'status': true}
                       
                    },(err,item)=>{
                        if (err) console.log(err) 
                        else {
                        console.log(item)}
                        res.status(200).send(item).end()
                    }
            ); 

    }catch(e){
        console.log(e)
    }
}


async function attendance_false(req, res) {
    try{
        // let user_group = await USER_GROUP.find({group_id: mongoose.Types.ObjectId(req.body.group_id), user_id: mongoose.Types.ObjectId(req.body.user_id)});

      

        USER_GROUP_TIME.update(
            {'group_user_id': mongoose.Types.ObjectId(req.body.group_user_id),
            'time_id': mongoose.Types.ObjectId(req.body.time_id)},
                { $set:
                       
                        { 'status': false}
                       
                    },(err,item)=>{
                        if (err) console.log(err) 
                        else {
                        console.log(item)}
                        res.status(200).send(item).end()
                    }
            ); 

    }catch(e){
        console.log(e)
    }
}





function get_all_users(req, res) {
    try {

        USER_GROUP.find({ group_id: mongoose.Types.ObjectId(req.params.group_id) }, (err, users_in_group) => {
            let array_els = users_in_group.map((value, index) => {

                return value.user_id
            })

            USERS.aggregate([
                { $match: { 'role': 0 } },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        name: 1,
                        "in_group": {
                            $in: ["$_id", array_els]
                        }
                    }
                }
            ]).exec((err, result) => {
                if (err) throw new Error(err)
                else {
                    res.status(200).send(result).end()

                }
            })

        })
    } catch (e) {
        console.log(e)

    }


}





function search_user(req, res) {
    USERS.aggregate([
        { $match: { 'role': 0 } },
        {
            $match: {
                $or: [{
                        "name": { $regex: req.params.text, $options: 'i' },
                        "surname": { $regex: req.params.text, $options: 'i' }
                    }


                ]
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
    get_homework,
    homework,
    create_group,
    get_group_name,
    get_user_groups,
    get_course_groups,
    add_user_to_group,
    delete_user_in_group,
    get_group_time,
    get_users_in_group,
    get_all_users,
    search_user,
    mark_student_paid,
    mark_student_notpaid,
    attendance_false,
    attendance_true

}