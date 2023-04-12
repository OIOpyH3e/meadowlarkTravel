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
    const largeRecepientList = new Array(2000).fill().map((_, idx) => `customer${idx}@nowhere.com`)
    // LargeRecepientList это массив адресов электронной почты
    const recepientLimit = 100
    const batches = largeRecepientList.reduce((batches, r) => {
        const lastBatch = batches[batches.length - 1]
        if(lastBatch.length < recepientLimit)
        lastBatch.push(r)
        else 
        batches.push([r])
        return batches
    }, [[]])
    try {
        const results = await Promise.all(batches.map(batch =>
            mailTransport.sendMail({
                from: '"Nurik" <nurik87@list.ru>',
                to: batch.join(', '),
                subject: 'Специальное предложение на пакет Худ Ривер!',
                text: 'Закажите поездку на прекрасную Худ Ривер сейчас!',
            })
             ))
             console.log(results)
    } catch(err) {
        console.log('по крайней мере один пакет писем не был доставлен: ' + err.message)
    }
}

go()