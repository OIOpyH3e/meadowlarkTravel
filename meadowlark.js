const fortune = require('./lib/fortune');
const express = require('express');
const expressHandlebars = require('express-handlebars');

const app = express();

const port = process.env.PORT || 3000;
//Настройка механизма представлений Handlebars
app.engine(
    'handlebars',
    expressHandlebars.engine({
        defaultLayout: 'main',
    })
);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));

app.get('/about', (req, res) => {
    res.render('about', { fortune: fortune.getFortune() });
});

//Пользовательская страница 404
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

//Пользовательская страница 500
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500);
    res.render('500');
});

app.listen(port, () =>
    console.log(
        `Express запущен на http://localhost:${port}; ` +
            `нажмите CTRL+C для завершения.`
    )
);
