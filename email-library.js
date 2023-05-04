const credentials = require('./credentials')

const emailService = require('./lib/email')(credentials)

const email = 'e@zepln.com'

if(email) {
    emailService.send(email, "Сегодня распродажа туров в Худ Ривер!", 
    "Разбирайте их пока они горячие!")
    .then(() => {
        console.log('письмо успешно отправлено!')
    })
    .catch(err => {
        console.log('не удалось отправить письмо: ', err.message)
    })
} else {
    console.log('Исправьте этот файл, и исправьте адрес электронной почты для тестирования ...')
}