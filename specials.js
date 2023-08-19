/* eslint-disable no-undef, no-unused-vars */
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
// Это необходимо для использования представлений
// Это нужно для использования представлений
app.engine(
    'handlebars',
    expressHandlebars.engine({
        defaultLayout: 'main',
        helpers: {
            section: function (name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
        },
    })
);
app.set('view engine', 'handlebars');

// Для изображений и статических файлов

app.use(express.static(__dirname + './public/'))

// Эта функция симулирует асинхронное подключение к БД, которое возвращает специальные предложения
async function getSpecialsFromDatabase() {
    return {
        name: 'Deluxe Technicolor Widget',
        price: '$29.95,'
    }
}

async function specials(req, res, next) {
    res.locals.special = await getSpecialsFromDatabase()
    next()
}

app.get('/page-with-specials', specials, (req, res) => res.render('page-with-specials')
)

app.get('*', (req, res) => res.send('Проверьте страницу "<a href="/page-with-specials">Специальные предложения</a>"!'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nперейдите на http://localhost:${port}/page-with-specials`))

/* eslint-enable no-undef, no-unused-vars */