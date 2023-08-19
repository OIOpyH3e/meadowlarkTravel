/* eslint-disable no-unused-vars */
const main = require('./handlers/main')

module.exports = app => {

    app.get('/', (req, res) => main.home)

    app.get('/about', (req, res) => main.about)



}

/* eslint-enable no-unused-vars */