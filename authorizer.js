/* eslint-disable no-undef, no-unused-vars */

const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

// Следующее промежуточное РО необходимо для сессий (симулирующих) авторизацию
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const cookieSecret = Math.random().toString()
app.use(cookieParser(cookieSecret))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: cookieSecret,
}))


// Это нужно для использования представлений
app.engine(
    'handlebars',
    expressHandlebars.engine({
        defaultLayout: '04-main',
        helpers: {
            section: function (name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
        },
    })
);
app.set('view engine', 'handlebars');

// Для изображений и статических файлов
app.use(express.static(__dirname + './public/'))

// Для ищображений и статических файлов
app.use(express.static(__dirname + '/public'))

// Это наша "ложная" авторизация ... мы не проверяем имя пользователя и пароль
app.post('/login', (req, res) => {
    req.session.user = { email: req.body.email }
    req.session.authorized = true
    res.redirect('/secret')
})

// Ложно разлогирование
app.get('/logout', (req, res) => {
    delete req.session.user
    delete req.session.authorized
    res.redirect('/public')
})

// Сделайте объект пользователя доступным для всех представлений вложенного в контекст "locals"
app.use((req, res, next) => {
    if(req.session) res.locals.user = req.session.user
    next()
})

function authorize(req, res, next) {
    if(req.session.authorized) return next()
    res.render('not-authorized')
}

app.get('/public', (req, res) => res.render('public'))

app.get('/secret', authorize, (req, res) => res.render('secret'))

app.get('*', (req, res) => res.send('Проверьте страницу <a href="/public">Публичное содержимое</a>.'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nПерейдите на http://localhost:${port}/public`))

/* eslint-enable no-undef, no-unused-vars */
