/* eslint-disable no-undef, no-unused-vars */

const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

// Это необходимо для использования представлений
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
app.use(express.static(__dirname + '/public'))

const staff = {
    mitch: {
        name: "Митч",
        bio: "Митч - человек, который прикроет вашу спину во время драки в баре."
    },
    madeline: {
        name: "Мадлен",
        bio: "Мадлен - наш специалист по Орегону."
    },
    walt: {
        name: "Уолт",
        bio: "Уолт - наш специалист по пансионату Орегон Коуст."
    },
}

app.get('/staff/:name', (req, res,next) => {
    const info = staff[req.params.name]
    if(!info) return next() // В конечном счете передаст управление обработчику 404
    res.render('staffer', info)
})

app.get('/staff', (req, res) => {
    res.render('staff', { staffUrls: Object.keys(staff).map(key => '/staff/' + key) })
})

app.get('*', (req, res) => res.send('Проверьте страницу "<a href="/staff">Страница персонала</a>".'))


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nПерейдите на http://localhost:${port}/staff`))
/* eslint-enable no-undef, no-unused-vars */