const Joi = require('joi')

module.exports = {
  signupPolicy (req, res, next) {
    const schema = {
      email: Joi.string().email(),
      password: Joi.string(),
      gender:Joi.boolean(),
      phone_number:
      Joi.number().regex(
        new RegExp('^[0-9]{10,11}')
      ),
      birth_date:Joi.date().options({ convert: true }),
      name:Joi.string().regex(
        new RegExp('^[A-Za-z0-9]{6,32}')
      ),
      name:Joi.string().regex(
        new RegExp('^[A-Za-z0-9]{6,32}')
      ),
      middle_name:Joi.string().regex(
        new RegExp('^[A-Za-z0-9]{6,32}')
      ),
      photo_url:Joi.string().regex(
        new RegExp('^[A-Za-z0-9]{6,32}')
      )

      
    }
    const {err} = Joi.validate(req.body, schema)

    if (err) {
      switch (err.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'your email is not vaild'
          })
          break
        case 'user':
          res.status(400).send({
            error: `The username provided failed to match the following rules:
              <br>
              1. It must contain ONLY the following characters: lower case, upper case, numerics.
              <br>
              2. It must be at least 8 characters in length and not greater than 32 characters in length.
            `
          })
          break
        case 'password':
          res.status(400).send({
            error: `The password provided failed to match the following rules:
              <br>
              1. It must contain ONLY the following characters: lower case, upper case, numerics.
              <br>
              2. It must be at least 8 characters in length and not greater than 32 characters in length.
            `
          })
          break
        default:
          res.status(400).send({
            error: err
          })
      }
    } else {
      next()
    }
  },

  passwordPolicy(req, res, next){
    const schema = {
      password: Joi.string().required().min(6)
    }
    Joi.validate({'password':req.body.password}, schema, function (err, value) { 
      if (err) {
        console.log(err)
        res.status(400).send({
          error: `Пароль должен быть минимум 6 символов`
        })
  
      }else{
        // console.log("errorr")
        next()
      }
    })

   
  }
}