const express = require('express')
/* eslint-disable no-unused-vars */
const expressHandlebars = require('express-handlebars')
const app = express()
/* eslint-enable no-unused-vars */

app.get('/fifty-fifty', (req, res, next) => {
    if(Math.random() < 0.5) return next()
    res.send('иногда это')
})
app.get('/fifty-fifty', (req, res) => {
    res.send('а иногда это')
})

app.get('*', (req, res) => res.send('Проверьте страницу "<a href="/fifty-fifty">Пятьдесят на пятьдесят</a>"!'))

/* eslint-disable no-undef */
const port = process.env.PORT || 3000
app.listen(port, () => console.log(
    `\nперейдите на http://localhost:${port}/fifty-fifty\n` +
    "\nи перегрузите страницу несколько раз\n"))