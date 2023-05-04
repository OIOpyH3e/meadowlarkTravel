const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser  = require('cookie-parser')
const expressSession = require('express-session')
const nodemailer = require('nodemailer')
const htmlToFormattedText = require('html-to-formatted-text')

const app = express()

const credentials = require('./credentials')

// Слегка измененная версия официального W3C HTML5 regex
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
/* eslint-disable no-useless-escape */
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')
/* eslint-enable no-useless-escape */

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

/* eslint-disable no-undef */
app.use(express.static(__dirname + '/public'))
/* eslint-enable no-undef */

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}))

const mailTransport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    auth: {
        user: credentials.sendgrid.user,
        pass: credentials.sendgrid.password,
    },
})

app.post('/cart/checkout', (req, res, next) => {
    const cart = req.session.cart
    if(!cart) next( new Error('Заказ не существуетю'))
    const name = req.session.name || '', email = req.session.email || ''
    // ввод данных
    if(!email.match(VALID_EMAIL_REGEX))
    return res.next(new Error('Неподходящий адрес электронной почты.'))
    // Введем произвольный номер заказа; в идеале он должен использовать номер из базы данных
    cart.number = Math.random().toString().replace(/^0\.0*/, '')
    cart.billing = {
        name: name,
        email: email,
    }
    res.render('email/cart-thank-you', { layout: null, cart: cart },
    (err, html) => {
        console.log('электронная почта: ', html)
        if(err) console.log('ошибка в адресе электронной почты')
        mailTransport.sendMail({
            from: '"Meadowlark Travel" <nurik87@list.ru>',
            to: cart.billing.name,
            subject: 'Спасибо за заказ поездки в Meadowlark Travel',
            html: html,
            text: htmlToFormattedText(html),
        })
        .then(info => {
            console.log('отправлено!', info)
            res.render('cart-thank-you', { cart: cart })
        })
        .catch(err => {
            console.error('Невозможно отправить подтверждение: ' + err.message)
        })
    }
    )
})

app.get('*', (req, res) => {
    // симулируем покупку
    req.session.cart = {
        items: [
            { id: '82RgrqGCAHqCf6rA2vujbT', qty: 1, guests: 2 },
            { id: 'bqBtwqxpB4ohuxCBXRE9tq', qty: 1 },
          ],
    }
    res.render('home')
})

/* eslint-disable no-undef */
const port = process.env.PORT || 3000
/* eslint-enable no-undef */
app.listen(port, () => console.log(`\nсервер запущен на http://localhost:${port}\n`))