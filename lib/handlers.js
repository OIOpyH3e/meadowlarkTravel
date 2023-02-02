const fortune = require('./fortune');

exports.home = (req, res) => res.render('home');

exports.about = (req, res) =>
    res.render('about', { fortune: fortune.getFortune() });

exports.notFound = (req, res) => res.render('404');

// Express распознает обработчик ошибок по четырем аргументам,
// поэтому нам нужно отключить правило no-used-vars в ESLint.
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */