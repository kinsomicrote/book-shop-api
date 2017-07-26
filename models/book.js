'use strict'

const mongoose          = require('mongoose'),
      mongooseApiQuery  = require('mongoose-api-query'),
      timestamps        = require('mongoose-timestamp')

const BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    enum: ['pending', 'reading', 'completed']
  },
}, { minimize: false })

BookSchema.plugin(mongooseApiQuery)
BookSchema.plugin(timestamps)

const Book = mongoose.model('Book', BookSchema)
module.exports = Book