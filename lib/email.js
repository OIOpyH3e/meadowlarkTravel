const nodemailer = require('nodemailer')
const htmlToFormattedText = require('html-to-formatted-text')

module.exports = credentials => {

    const mailTransport = nodemailer.createTransport({
        host: 'smtp.sendgrid',
        auth: {
            user: credentials.sendgrid.user,
            pass: credentials.sendgrid.password,
        },
    })

    const from = '"Meadowlark Travel" <info@meadowlarktravel.com>'
    /* eslint-disable no-unused-vars */
    const errorRecipient = 'youremail@gmail.com'
    /* eslint-enable no-unused-vars */

    return {
        send: (to, subject, html) => 
        mailTransport.sendMail({
            from,
            to,
            subject,
            html,
            text: htmlToFormattedText(html),
        }),
    }

}