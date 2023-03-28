exports.api = {};

const fortune = require('./fortune');

exports.home = (req, res) => res.render('home');

exports.newsletterSignup = (req, res) => {
    // Мы изучим CSFR позже ... сейчас мы лишь
    // вводим фиктивное значение.
    res.render('newsletter-signup', { csrf: 'Здесь находится токен CSRF' });
};
exports.newsletterSignupProcess = (req, res) => {
    console.log('Форма (из строки запроса): ' + req.query.form);
    console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf);
    console.log('Имя (из видимого поля формы): ' + req.body.name);
    console.log('Email (из видимого поля формы): ' + req.body.email);
    res.redirect(303, '/newsletter-signup/thank-you');
};
exports.newsletterSignupThankYou = (req, res) =>
    res.render('newsletter-signup-thank-you');

exports.newsletter = (req, res) => {
    // Мы изучим CSRF позже... сейчас мы лишь
    // вводим фиктивное значение.
    res.render('newsletter', { csrf: 'Здесь находится токен CSRF' });
};
exports.api.newsletterSignup = (req, res) => {
    console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf);
    console.log('Имя (из видимого поля формы): ' + req.body.name);
    console.log('Email (из видимого поля формы): ' + req.body.email);
    res.send({ result: 'success' });
};

exports.vacationPhotoContest = (req, res) => {
    const now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth(),
    });
};

exports.vacationPhotoContestAjax = (req, res) => {
    const now = new Date();
    res.render('contest/vacation-photo-ajax', {
        year: now.getFullYear(),
        month: now.getMonth(),
    });
};

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
    console.log('данные поля: ', fields);
    console.log('файлы: ', files);
    res.redirect(303, '/contest/vacation-photo-thank-you');
};

exports.vacationPhotoContestProcessThankYou = (req, res) => {
    res.render('contest/vacation-photo-thank-you');
};

exports.api.vacationPhotoContest = (req, res, fields, files) => {
    console.log('данные поля: ', fields);
    console.log('файлы: ', files);
    res.send({ result: 'success' });
};

exports.api.vacationPhotoContestError = (req, res, message) => {
    res.send({ result: 'error', error: message });
};

exports.about = (req, res) =>
    res.render('about', { fortune: fortune.getFortune() });

exports.notFound = (req, res) => res.render('404');

// Express распознает обработчик ошибок по четырем аргументам,
// поэтому нам нужно отключить правило no-used-vars в ESLint.
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */
