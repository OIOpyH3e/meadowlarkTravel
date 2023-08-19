/* eslint-disable no-undef, no-unused-vars */
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

app.get('/rgb', (req, res, next) => {
    // Треть запросов должна возвращать "красный"
    if(Math.random() < 0.33) return next()
    res.send('красный')
},
(req, res, next) => {
    // Половина от оставшихся двух третей запросов (иначе вторая треть)
    // вернкт "зеленый"
    if(Math.random() < 0.5) return next()
    res.send('зеленый')
},
function(req, res){
    // И последняя треть вернет "синий"
    res.send('синий')
},
)

app.get('*', (req, res) => res.send('Проверьте страницу "<a href="/rgb">Красны - зеленый - синий</a>"!'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(
    `\nперейдите на http://localhost:${port}/rgb\n` +
    "\n и обновите ее несколько раз.\n"))
/* eslint-enable no-undef, no-unused-vars */