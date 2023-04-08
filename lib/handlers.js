// Немного измененная версия официального регулярного выражения
// W3C HTML5 для электронной почты
// https://html.spec.whatg.org/multipage/forms.htmlvalid-e-mail-address.
/* eslint-disable no-useless-escape */
const VALID_EMAIL_REGEX = new RegExp(
    "^[z-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@" +
        '[z-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
        '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$'
);
/* eslint-enable no-useless-escape */
// ложный интерфейс "подписки на обновления"
class NewsletterSignup {
    constructor({ name, email }) {
        this.name = name;
        this.email = email;
    }
    async save() {
        // Здесь будет проводиться работа по сохранению в базу данных
        // и пока метод асинхронный, он будет возвращать промис, и
        // пока мы не выбрасываем какие-либо ошибки, промис будет
        // успешно завершен
    }
}

exports.api = {};

const fortune = require('./fortune');

exports.home = (req, res) => res.render('home');

exports.newsletterSignup = (req, res) => {
    // Мы изучим CSFR позже ... сейчас мы лишь
    // вводим фиктивное значение.
    res.render('newsletter-signup', { csrf: 'Здесь находится токен CSRF' });
};
exports.newsletterSignupProcess = (req, res) => {
    const name = req.body.name || '',
        email = req.body.email || '';
    // ввод проверки
    if (!VALID_EMAIL_REGEX.test(email)) {
        req.session.flash = {
            type: 'danger',
            intro: 'Ошибка проверки!',
            message: 'Введенный вами адрес электронной почты некорректен.',
        };
       return res.redirect(303, '/newsletter-signup');
    }
    // NewsletterSignup - пример объекта, который вы могли бы
    // создать; поскольку все реализации различаются, оставляю
    // написание этих зависящих от конкретного проекта интерфейсов
    // на ваше усмотрение. Это просто демонстрация того, как типичная
    // реализация на основе Express может выглядеть  в вашем прогекте.
    new NewsletterSignup({ name, email }).save().then(() => {
        req.session.flash = {
            type: 'success',
            intro: 'Спасибо!',
            message: 'Вы были подписаны на новостную рассылку.',
        };
        return res.redirect(303, '/newsletter-archive');
    })
    /* eslint-disable no-unused-vars */
    .catch(err => {
        req.session.flash = {
            type: 'danger',
            intro: 'Ошибка базы данных!',
            message: 'Произошла ошибка базы данных, пожалуйста попробуйте позже.',
        }
        return res.redirect(303, '/newsletter-archive')
    })
    /* eslint-enable no-unused-vars */
};
exports.newsletterSignupThankYou = (req, res) =>
    res.render('newsletter-signup-thank-you');

exports.newsletterArchive = (req, res) => res.render('newsletter-archive');

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
