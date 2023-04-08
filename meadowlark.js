const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const credentials = require('./credentials');
const handlers = require('./lib/handlers');
const weatherMiddleware = require('./lib/middleware/weather');
const flashMiddleware = require('./lib/middleware/flash');

const app = express();

// ESLint не опраделяет глобальные переменные process и __dirname
// поэтому необходимо отключить это правило для данных строк

/* eslint-disable no-undef */
const port = process.env.PORT || 3000;
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
    })
);

/* eslint-disable no-undef */
app.use(express.static(__dirname + '/public'));
/* eslint-enable no-undef */

app.use(weatherMiddleware);
app.use(flashMiddleware);

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

//Пользовательская страница 404
app.use(handlers.notFound);

//Пользовательская страница 500
app.use(handlers.serverError);

if (require.main === module) {
    app.listen(port, () => {
        console.log(
            `Express запущен на http://localhost:${port}` +
                `; нажмите Ctrl+C для завершения.`
        );
    });
} else {
    module.exports = app;
}
