const _       = require('lodash'),
      errors  = require('restify-errors')


const Book = require('../models/book')

server.post('/books', (req, res, next) => {
  let data = req.body || {}

  let book = new Book(data)
  book.save((err) => {

    if (err) {
      log.error(err)
      return next(new errors.InternalError(err.message))
    }

    res.send(201)
    next
  })
}) 

server.get('/books', (req, res, next) => {
  Book.apiQuery(req.params, (err, docs) => {

    if (err) {
      log.error(err)
      return next(new errors.InvalidContentError(err.errors.name.message))
    }

    res.send(docs)
    next
  })
})

server.get('/books/:book_id', (req, res, next) => {

  Book.findOne({_id: req.params.book_id}, (err, doc) => {
    if (err) {
      log.error(err)
      return next(new errors.InvalidContentError(err.errors.name.message))
    }

    res.send(doc)
    next()
  })
})