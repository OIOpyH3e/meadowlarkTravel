const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const morgan = require('morgan')
const fs = require('fs')
const cluster = require('cluster')
const Sentry = require('@sentry/node')
const RedisStore = require('connect-redis')(expressSession)

const credentials = require('./credentials');
const handlers = require('./lib/handlers');
const weatherMiddleware = require('./lib/middleware/weather');
const flashMiddleware = require('./lib/middleware/flash');
Sentry.init({ dsn: 'https://4b2ed9dfdffa41228d7aab5c0e65a912@o4505127466303488.ingest.sentry.io/4505127473905664' })
require('./db')


const app = express();

// ESLint не опраделяет глобальные переменные process и __dirname
// поэтому необходимо отключить это правило для данных строк

/* eslint-disable no-undef */
// const port = process.env.PORT || 3000;
/* eslint-enable no-undef */

//Настройка механизма представлений Handlebars
app.engine(
    'handlebars',
    expressHandlebars.engine({
        defaultLayout: 'main',
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser(credentials.cookieSecret));
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: credentials.cookieSecret,
        store: new RedisStore({
            url: credentials.redis.url,
        }),
    })
);

/* eslint-disable no-undef */
app.use(express.static(__dirname + '/public'));
/* eslint-enable no-undef */

app.use(weatherMiddleware);
app.use(flashMiddleware);

app.use((req, res, next) => {
    if(cluster.isWorker)
    console.log(`Исполнитель ${cluster.worker.id} получил запрос`)
    next()
})

app.get('env');

// Функциональность записи в лог, всего что происходит на сервере
/* eslint-disable no-case-declarations, no-undef*/
switch(app.get('env')) {
    case 'development':
        app.use(morgan('dev'))
        break
        case 'production':
            const stream = fs.createWriteStream(__dirname + '/access.log', 
            {flags: 'a' })
            app.use(morgan('combined', { stream }))
            break
}
/* eslint-enable no-case-declarations, no-undef */

app.get('/', handlers.home);

app.get('/about', handlers.about);

app.get('/newsletter-signup', handlers.newsletterSignup);
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou);
app.get('/newsletter-archive', handlers.newsletterSignupThankYou)

app.get('/newsletter', handlers.newsletter);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

app.get('/contest/vacation-photo', handlers.vacationPhotoContest);
app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax);
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).send({ error: err.message });
        handlers.vacationPhotoContestProcess(req, res, fields, files);
    });
});
app.get(
    '/contest/vacation-photo-thank-you',
    handlers.vacationPhotoContestProcessThankYou
);
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err)
            return handlers.api.vacationPhotoContestError(
                req,
                res,
                err.message
            );
        handlers.api.vacationPhotoContest(req, res, fields, files);
    });
});

/* eslint-disable no-unused-vars, no-undef */
app.get('/fail', (req, res) => {
    throw new Error('Нет!')
})

app.get('/epic-fail', (req, res) => {
    process.nextTick(() => {
        throw new Error('Бабах!')
    })
    res.send('embrassed')
})

process.on('uncaughtException', err => {
    console.error('НЕПЕРЕХВАЧЕННОЕ ИСКЛЮЧЕНИЕ\n', err.stack);
    // Выполните здесь всю необходимую очистку данных ...
    // Закройте соединение с базой данных и т.д.
    Sentry.captureException(err)
    process.exit(1)
})

// Отпускные туры
app.get('/vacations', handlers.listVacations)
app.get('/notify-me-when-in-season', handlers.notifyWhenInSeasonForm)
app.post('/notify-me-when-in-season', handlers.notifyWhenInSeasonProcess)

// Переключение валюты
app.get('/set-currency/:currency', handlers.setCurrency)

//Пользовательская страница 404
app.use(handlers.notFound);

//Пользовательская страница 500
app.use((err, req, res, next) => {
    console.error(err.message, err.stack)
    app.status(500).render('500')
});
/* eslint-enable no-unused-vars, no-undef */

function startServer(port) {
    app.listen(port, function() {
         console.log(`Express запущен в режиме ${app.get('env')} на http://localhost:${port}` +
                `; нажмите Ctrl+C для завершения.`)
    })
}

if(require.main === module) {
    // Приложение запускается непосредственно;
    // запускается сервер приложения.
    /* eslint-disable no-undef */
    startServer(process.env.PORT || 3000)
    /* eslint-enable no-undef */
} else {
    // Приложение импортируется как модуль с помощью "require":
    // Экспортируем функцию для создания сервера
    module.exports = startServer
}
