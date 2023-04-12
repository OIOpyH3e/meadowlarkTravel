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
            from: '"Nurbek" <nurik87@list.ru>',
            to: 'n.raimbaev@yandex.ru',
            subject: 'Ваш тур Meadowlark Travel',
            text: 'Спасибо за заказ поездки в Meadowlark Travel. ' + 
            'С нетерпением ждем Вас!',
        })
        console.log('письмо успешно отправлено: ' + result)
    } catch (err) {
        console.log('невозможно отправить письмо: ' + err.message)
    }
}

go()