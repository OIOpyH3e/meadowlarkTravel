const handlers = require('./lib/handlers');
const express = require('express');
const expressHandlebars = require('express-handlebars');

const app = express();

// ESLint не опраделяет глобальные переменные process и __dirname
// поэтому необходимо отключить это правило для данных строк

/* eslint-disable no-undef */
const port = process.env.PORT || 3000;
/* eslint-enable no-undef */

//Настройка механизма представлений Handlebars
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

/* eslint-disable no-undef */
app.use(express.static(__dirname + '/public'));
/* eslint-enable no-undef */

app.get('/', handlers.home);

app.get('/about', handlers.about);

//Пользовательская страница 404
app.use(handlers.notFound);

//Пользовательская страница 500
app.use(handlers.serverError);

if (require.main === module) {
    app.listen(port, () => {
        console.log(
            `Express запущен на http://localhost:${port}` +
                `; нажмите Ctrl+C для завершения.`
        );
    });
} else {
    module.exports = app;
}
