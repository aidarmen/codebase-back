const Configs = require('../config/config')
const jwt = require('jsonwebtoken')
const USER = require('../models/user')

function verifyJWT_MW(req, res, next) {
    // var token = req.body.token || req.query.token || req.headers['Authorization'];

    
    var token = req.body.token || req.headers['authorization']

    if (token) {

            // verifies secret and checks exp
        jwt.verify(token, Configs.auth.JWT_SECRET, function(err, user) {
            if (err) {

                return res.status(404).send({ err: err.name, err_msg: err.message, data: null });
            } else {
                // if everything is good, save to request for use in other routes
                req.user = user;
                next();


            }
        });

    } else {

        return res.status(404).send({ err: 'No token provided.', data: null });

    }

}

// function verifyJWT_RESET_MW(req, res, next)
// {
//     // var token = req.body.token || req.query.token || req.headers['Authorization'];


//     var token = req.body.token;

//     if(token) {

//         // verifies secret and checks exp
//         jwt.verify(token, Configs.auth.JWT_SECRET, function(err, user) {      
//             if (err) {
//                 return res.status(404).send({err: err.name, err_msg: err.message, data: null});    
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.user = user;    
//                 next();
//             }
//         });

//     } else {
//         return res.status(404).send({err: 'No token provided.', data: null});

//     }

// }


module.exports = {
    verifyJWT_MW
}