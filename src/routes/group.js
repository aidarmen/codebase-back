const express = require('express')
const router = express.Router()
const { verifyJWT_MW } = require('../middlewares/auth.mw')

const {
    get_homework,
    homework,
    create_group,
    get_user_groups,
    get_course_groups,
    add_user_to_group,
    get_group_time,
    get_users_in_group,
    delete_user_in_group,
    get_all_users,
    search_user,
    get_group_name,
    mark_student_notpaid,
    mark_student_paid,
    attendance_false,
    attendance_true,
    paid
} = require('../controllers/group.controller')

router.post('/homework', verifyJWT_MW, homework)
router.post('/create', verifyJWT_MW, create_group)
router.post('/add_student', verifyJWT_MW, add_user_to_group)
router.post('/delete_student', verifyJWT_MW, delete_user_in_group)
router.get('/get', verifyJWT_MW, get_user_groups)
router.get('/get_all_users/:group_id', verifyJWT_MW, get_all_users)
router.get('/search_user/:text', verifyJWT_MW, search_user)
router.get('/get_course/:course_id', get_course_groups)
router.get('/get_group_time/:group_id', get_group_time)
router.get('/get_users_in_group/:group_id', verifyJWT_MW, get_users_in_group)
router.get('/get_group_name/:group_id', verifyJWT_MW, get_group_name)
router.get('/get_homework/:group_id', verifyJWT_MW, get_homework)
router.post('/mark_student_paid', mark_student_paid)
router.post('/mark_student_notpaid', mark_student_notpaid)
router.post('/attendance_true', attendance_true)
router.post('/attendance_false',verifyJWT_MW, attendance_false)
router.get('/paid/:group_id',verifyJWT_MW, paid)

// router.post('/get' ,verifyJWT_MW,get_user_groups)
// router.post('/getall' ,verifyJWT_MW,get_user_groups)

module.exports = router