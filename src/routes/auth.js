const express = require('express')
const router = express.Router()

const { signup, signin,reset ,changepassword} = require('../controllers/auth.controller')
const { passwordPolicy } = require('../policies/auth.policy')

router.post('/signup' ,signup, signin)
router.post('/signin', signin)
router.post('/reset', reset)


const { verifyJWT_MW } = require('../middlewares/auth.mw')
router.post('/changepassword',verifyJWT_MW , passwordPolicy , changepassword )
// router.post('/reset', signin)


router.post('/me', verifyJWT_MW,(req,res) => {
    res.status(200).send({ data: req.user});

})

module.exports = router