const mongoose = require('mongoose')

const vacationInSeasonListener = mongoose.Schema({
    email: String,
    skus: [String],
})
const VacationInSeasonListener = mongoose.model('VacationInSeasonListener', 
vacationInSeasonListener)

module.exports = VacationInSeasonListener