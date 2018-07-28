const USER = require('../models/user')
const Config = require('../config/config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


function signup(req, res, next) {
    USER.find({ email: req.body.email }, (err, users) => {

        if (err) {
          
            res.status(400).send({ err: err, data: null }).end()
        } else if (users && users.length > 0) res.status(400).send({ err: 'Ошибка. Email уже используется.', data: null }).end()
        else {

            // create a sample user
            var newUser = new USER({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password),
                role: req.body.role,
                name: req.body.name,
                surname: req.body.surname,
                photo_url: ''
            });


            newUser.save(function(err, user) {

                if (err) res.status(400).send({ err: 'Ошибка. Email уже используется.', data: null }).end()
                else {
                    next()
                }
            })

        }
    })

}

function signin(req, res) {
    USER.findOne({
        email: req.body.email
    }, (err, user) => {


        if (err)
            res.status(400).send({ err: err, data: null }).end()

        if (!user) {
            res.status(400).send({ err: 'Введен неверный логин или пароль', data: null }).end()
        } else if (user) {

            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.status(400).send({ err: 'Введен неверный логин или пароль.', data: null }).end()
            } else {


                const payload = {
                    _id: user._id,
                    email: user.email,
                    role: user.role
                }

                var token = jwt.sign(payload, Config.auth.JWT_SECRET, {
                    expiresIn: Config.auth.tokenExpiry // expires in 1 hour
                })

                res.status(200).send({ err: err, data: { user: payload, token: token } }).end()
            }

        }

    });
}

function reset(req, res) {
    USER.findOne({
        email: req.body.email
    }, (err, user) => {


        if (err)
            res.status(400).send({ err: err, data: null }).end()

        if (!user) {
            res.status(400).send({ err: 'Неправильный email', data: null }).end()
        } else if (user) {
            const payload = {
                _id: user._id,
                email: user.email
            }
            var token = jwt.sign(payload, Config.auth.JWT_SECRET, {
                expiresIn: Config.auth.tokenExpiry // expires in 1 hour
            })



            // var transporter = nodemailer.createTransport(smtpTransport({


            // }));
            var transporter = nodemailer.createTransport(smtpTransport({
                // host: "outmail.abc.co.th", // hostname
                service: 'gmail',
                secure: false, // use SSL
                port: 465, // port for secure SMTP
                auth: {
                    user: 'codebase.edu@gmail.com',
                    pass: 'codebase123@'
                },
                tls: {
                    rejectUnauthorized: false
                }
            }));

            var mailOptions = {
                from: 'codebase.edu@gmail.com',
                to: user.email,
                subject: 'Reset Password',
                // text: 'That was easy!',
                html: `http://${req.headers.host}/auth/reset/${token}`
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.status(200).send({ send: true }).end()
                    console.log('Email sent: ' + info.response);
                    transporter.close();
                }
            });




        }

    });


}

function changepassword(req, res) {

    USER.findOne({
            email: req.user.email
        }, (err, user) => {
            USER.findByIdAndUpdate(user._id, { $set: { password: bcrypt.hashSync(req.body.password) } }, function(err, tank) {
                if (err) console.log(err)
                res.send({
                    'change': true
                });
            });
        })
        // res.send(req.user)
}




module.exports = {
    signup,
    signin,
    reset,
    changepassword

}