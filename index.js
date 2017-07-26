'use strict'

const config          = require('./config'),
      restify         = require('restify'),
      bunyan          = require('bunyan'),
      winston         = require('winston'),
      bunyanWinston   = require('bunyan-winston-adapter'),
      mongoose        = require('mongoose'),
      corsMiddleware  = require('restify-cors-middleware')

/**
 * Logging
 */

global.log = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      timestamp: () => {
        return new Date().toString()
      },
      json: true
    })
  ]
})

/**
 * Initialize server
 */

global.server = restify.createServer({
  name: config.name,
  version: config.version,
  log: bunyanWinston.createAdapter(log)
})

/**
 * Middleware
 */

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['http://localhost:8080'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})

server.pre(cors.preflight)
server.use(cors.actual)

server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())

/**
 * Error handling
 */

server.on('uncaughtException', (req, res, route, err) => {
  log.error(err.stack)
  res.send(err)
})

/**
 * Lift Server, connect to DB & Bind Routes
 */

server.listen(config.port, () => {

  mongoose.connection.on('error', (err) => {
    log.error('Mongoose default connection error: ' + err)
    process.exit(1)
  })

  mongoose.connection.on('open', (err) => {

    if(err) {
      log.error('Mongoose default connection error: ' + err)
      process.exit(1)
    }

    log.info(
      '%s v%s ready to accept connection on port %s in %s environment.',
      server.name,
      config.version,
      config.port,
      config.env
    )

    require('./routes')
  })

  global.db = mongoose.connect(config.db)
})

