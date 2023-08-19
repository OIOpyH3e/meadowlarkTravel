const express = require('express')
const vhost = require('vhost')
const app = express()

// Создайте поддомен 'admin'... это должно 
// находиться до всех ваших маршрутов
const admin = express.Router()
app.use(vhost('admin.meadowlark.local', admin))

// Создаем маршруты 'admin'; это может находиться где угодно
admin.get('*', (req, res) => res.send('Добро пожаловать, Администратор!'))

// Постоянные маршруты
app.get('*', (req, res) => res.send('Добро пожаловать, пользователь!'))

/* eslint-disable no-undef */
const port = process.env.PORT || 3000
app.listen(port, () => console.log(
    "\nубедитесь что вы исправили в файле hosts:" +
    "\n" +
    "\n 127.0.0.1 admin.meadowlark.local" +
    "\n 127.0.0.1 meadowlark.local" +
    "\n" +
    "\nзатем перейдите на:" +
    `\n http://meadowlark.local:${port}` + 
    "\n" +
    `\n и на http://admin.meadowlark.local:${port}\n`))
    /* eslint-enable no-undef */