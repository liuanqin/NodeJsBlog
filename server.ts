import express = require('express');
const articleRouter = require('./routes/article')
const Article = require('./models/article')
const app = express();
import methodOverride = require('method-override')
import mongoose = require('mongoose')

// blog is the DB name
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

app.set('view engine', 'ejs')

// we can access all the params from article forms inside article route
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', { articles: articles });
})

// every rest call in articleRouter will have /articles in the url
app.use('/articles', articleRouter)

app.listen(3001, () => {
    console.log('The application is listening on port 3000!');
})