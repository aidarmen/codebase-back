const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const logger = require('morgan')
const Configs = require('./src/config/config')
require('./src/config/db')
require('./src/controllers/cron.controller')

const app = new express()
app.set('port', process.env.PORT || 9000)

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json({limit: '100mb'}))
app.use(bodyParser.urlencoded({limit: '100mb', extended: true }))

app.use('/static/', express.static('static'))

app.use('/api', require('./src/routes'))

app.listen(app.get('port'), function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info('Web server is listening on port %s. Go to http: //localhost:%s/ and use it. Thks!', app.get('port'), app.get('port'))
  }
})
