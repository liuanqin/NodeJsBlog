import mongoose = require('mongoose')
import marked = require('marked')
import slugify = require('slugify')
const createDomPurifier = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurifier(new JSDOM().window)

const articleSchema = new mongoose.Schema ({
    title: {
        required: true,
        type: String,
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String, 
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String, 
        required: true,
    }
})

// this function will run everytime we insert, update, delete to this table
articleSchema.pre('validate', function(next) {
  if (this.title) {
      // strict: true will remove any chars not supported in url
      this.slug = slugify(this.title, { lower: true, strict: true })
  }
  if (this.markdown) {
      this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }
  next()
})

// export a new table called Article, using articleSchema
module.exports = mongoose.model('Article', articleSchema)