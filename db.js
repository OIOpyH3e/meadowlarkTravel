const credentials = require('./credentials')

// Инициализируем соединение с базой данных
/* eslint-disable no-undef */
const mongoose = require('mongoose')

// const env = process.env.NODE_ENV || "development"
const { connectionString } = credentials.mongo
if(!connectionString) {
    console.error('Отсутствует строка подключения к MongoDB!')
    process.exit(1)
}
mongoose.connect(connectionString, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', err => {
    console.error('Ошибка MongoDB: ' + err.message)
    process.exit(1)
})
db.once('open', () => console.log('Установлено соединение с MongoDB!'))
/* eslint-enable no-undef */

// Создание данных отпускных туров (если они не существуют)
const Vacation = require('./models/vacation.js')
Vacation.find((err, vacations) => {
    if(err) return console.error(err)
    if(vacations.length) return

    new Vacation({
        name: 'Однодневный тур в Худ Ривер',
        slug: 'hood-river-day-trip',
        category: 'Однодневный тур',
        sku: 'HR199',
        description: 'Проведите день в плавании по реке ' +
        'Колумбии и насладитесь сваренным по старинным рецептам пивом в Худ Ривер!',
        price: 99.95,
        tags: ['однодневный тур', 'худ ривер', 'плавание', 'виндсерфинг', 'пивоварни'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
    }).save()

    new Vacation({
        name: 'Отдых в Орегон Коуст',
        slug: 'oregon-coast-getaway',
        category: 'Отдых на выходных',
        sku: 'OC39',
        description: 'Насладитесь океанским воздухом и причудливыми прибрежными городками!',
        price: 269.95,
        tags: ['отдых на выходных', 'орегон коуст', 'прогулки по пляжу'],
        inSeason: false,
        maximumGuests: 8,
        available: true,
        packagesSold: 0,
    }).save()

    new Vacation({
        name: 'Скалолазание в Бенде',
        slug: 'rock-climbing-in-bend',
        category: 'Приключения',
        sku: 'B99',
        description: 'Пощекочите себе нервы горным восхождением на пустынной возвышенности.',
        price: 289.95,
        tags: ['отдых на выходные', 'бенд', 'пустынная возвышенность', 'скалолазание'],
        inSeason: true,
        requiresWaiver: true,
        maximumGuests: 4,
        available: false,
        packagesSold: 0,
        notes: 'Гид по данному туру в настоящий момент восстанавливается после лыжной травмы',
    }).save()
})

const VacationInSeasonListener = require('./models/vacationInSeasonListener')

module.exports = {
    getVacations: async (options = {}) => Vacation.find(options),
    addVacationInSeasonListener: async (email, sku) => {
        await VacationInSeasonListener.updateOne(
            { email },
            { $push: { skus: sku } },
            { upsert: true }
        )
    },
}