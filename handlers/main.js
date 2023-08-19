/* eslint-disable no-unused-vars */
const fortune = require('../lib/fortune')

exports.home = (req, res) => res.render('home')

exports.about = (req, res) => {
    const fortune = fortune.getFortune()
    res.render('about', { fortune })
}

/* eslint-enavle no-unused-vars */