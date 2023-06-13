const db = require('../db')

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

exports.about = (req, res) =>
    res.render('about', { fortune: fortune.getFortune() });

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

const pathUtils = require('path')
const fs = require('fs')

// Создаем каталог для хранения отпускных фото
// (если он еще не существует)
/* eslint-disable no-unused-vars, no-undef */
const dataDir = pathUtils.resolve(__dirname, '..', 'data')
const vacationPhotosDir = pathUtils.join(dataDir, 'vacation-photos')
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
if(!fs.existsSync(vacationPhotosDir)) fs.mkdirSync(vacationPhotosDir)

function saveContestEntry(contestName, email, year, month, photoPath) {
    // TODO ... будет написан позже
}
/* eslint-enable no-unused-vars, no-undef */
// Эти основанные на промисах версии функций
// файловой системы понадобятся нам позже.
const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)
const rename = promisify(fs.rename)

exports.api.vacationPhotoContest = async (req, res,fields, files) => {
    const photo = files.photo[0]
    const dir = vacationPhotosDir + '/' + Date.now()
    const path = dir + '/' + photo.originalFilename
    await mkdir(dir)
    await rename(photo.path, path)
    saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path)
    res.send({ result: 'success' })
}
exports.api.vacationPhotoContestError = (req, res, message) => {
    res.send({ result: 'error', error: message })
}

function convertFromUSD(value, currency) {
    switch(currency) {
        case 'USD': return value * 1
        case 'GBP': return value * 0.79
        case 'BTC': return value * 0.000078
        default: return NaN
    }
}

exports.listVacations = async (req, res) => {
    const vacations = await  db.getVacations({ available: true })
    const currency = req.session.currency || 'USD'
    const context = {
        currency: currency,
        vacations: vacations.map(vacation => {
            return {
                sku: vacation.sku,
                name: vacation.name,
                description: vacation.description,
                inSeason: vacation.inSeason,
                price: convertFromUSD(vacation.price, currency),
                qty: vacation.qty,
            }
        }),
    }
    switch(currency) {
        case 'USD': context.currencyUSD = 'selected'; break
        case 'GBP': context.currencyGBP = 'selected'; break
        case 'BTC': context.currencyBTC = 'selected'; break
    }
    res.render('vacations', context)
}

// Эти перенаправления для страницы с турами, но могут
// быть использованиы и на других страницах
exports.setCurrency = (req, res) => {
    req.session.currency = req.params.currency
    return res.redirect(303, '/vacations')
}

exports.notifyWhenInSeasonForm = (req, res) =>
res.render('notify-me-when-in-season', { sku: req.query.sku })

exports.notifyWhenInSeasonProcess = async (req, res) => {
    const { email, sku } = req.body
    await db.addVacationInSeasonListener(email, sku)
    return res.redirect(303, '/vacations')
}

exports.notFound = (req, res) => res.render('404');

// Express распознает обработчик ошибок по четырем аргументам,
// поэтому нам нужно отключить правило no-used-vars в ESLint.
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */
