const nodemailer = require('nodemailer')

const credentials = require('./credentials')

const mailTransport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    auth: {
        user: credentials.sendgrid.user,
        pass: credentials.sendgrid.password,
    },
})

async function go() {
    try {
        const result = await mailTransport.sendMail({
            from: '"Nurik" <nurik87@list.ru',
            to: 'n.raimbaev@gmail.com, "Nurbek Raimbaev" <n.raimbaev@yandex.ru>, ' +
            'm.bayaxmetova@inbox.ru',
            subject: 'Ваш тур Meadowlark Travel',
            html: '<h1>Meadowlark Travel</h1>\n<p>Спастбо за заказ поездки в ' +
            'Meadowlark Travel. <b>Мы ждем Вас с нетерпением!</b>',
            text: 'Спасибо за заказ поездки в Meadowlark Travel. ' +
            'Мы ждем Вас с нетерпением!',
        })
        console.log('письмо успешно отправлено: ', result)
    } catch(err) {
        console.log('невозможно отправить письмо: ' + err.message)
    }
}

go()