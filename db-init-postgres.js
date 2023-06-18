// const credentials = require('./credentials')

/* eslint-disable no-undef */
const { Client } = require('pg')
const connectionString = 'postgres://bnpnhrwp:mUevx6_gh7bulrZwaUztHoSS9ouqo7Lm@john.db.elephantsql.com/bnpnhrwp'
const client = new Client({ connectionString })
/* eslint-enable no-undef */

const createScript = `
CREATE TABLE IF NOT EXISTS vacations (
    name varchar(200) NOT NULL,
    slug varchar(200) PRIMARY KEY,
    category varchar(50),
    sku varchar(20),
    description text,
    location_search varchar(100) NOT NULL,
    location_lat double precision,
    location_lng double precision,
    price money,
    tags jsonb,
    in_season boolean,
    available boolean,
    requires_waiver boolean,
    maximum_guests integer,
    notes text,
    packages_sold integer
);
CREATE TABLE IF NOT EXISTS vacation_in_season_listeners (
    email varchar(200) NOT NULL,
    sku varchar(20) NOT NULL,
    PRIMARY KEY (email, sku)
);
`

const getVacationCount = async client => {
    const { rows } = await client.query('SELECT COUNT(*) FROM VACATIONS')
    return Number(rows[0].count)
}

const seedVacations = async client => {
    const sql = `
    INSERT INTO vacations(
    name,
    slug,
    category,
    sku,
    description,
    location_search,
    price,
    tags,
    in_season,
    available,
    requires_waiver,
    maximum_guests,
    notes,
    packages_sold
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `
    await client.query(sql, [
        'Однодневны тур в Худ-Ривер',
        'hood-river-day-trip',
        'Однодневный тур',
        'HR199',
        'Проведите день в плавании по реке Колумбии и насладитесь сваренным по традиционным рецептам пивом в Худ-Ривер',
        'Худ-Ривер, Орегон, США',
        99.95,
        `["однодневный тур", "худ-ривер", "плавание", "виндсерфинг", "пивоварни"]`,
        true,
        true,
        false,
        16,
        null,
        0
    ])
    await client.query(sql, [
        'Отдых в Орегон Коуст',
        'oregon-coast-getaway',
        'Отдых на выходные',
        'OC39',
        'Насладитесь океанским воздухом и причудливыми прибрежными городками!',
        'Кэннон Бич, Орегон, США',
        269.95,
        JSON.stringify(['отдых на выходные', 'орегон коуст', 'прогулки по пляжу']),
        false,
        true,
        false,
        8,
        '',
        0,       
    ])
    await client.query(sql, [
        'Скалолазание в Бенде',
        'rock-climbing-in-bend',
        'Приключения',
        'B99',
        'Опыт в покорении высокогорной пустынной местности.',
        'Бенд, Орегон, США',
        289.95,
        JSON.stringify(['отдых на выходные', 'бенд', 'высокогорная пустынная местность', 'скалолазание']),
        true,
        true,
        true,
        4,
        'Гид по данному туру восстанавливается после горнолыжной травмы.',
        0,
    ])
}

client.connect().then(async () => {
    try {
        console.log('создание схемы базы данных')
        await client.query(createScript)
        const vacationCount = await getVacationCount(client)
        if(vacationCount === 0) {
            console.log('внесение начальных данных отпускных туров')
            await seedVacations(client)
        }
    } catch(err) {
        console.log('ОШИБКА: невозможно инициализировать базу данных')
        console.log(err.message)
    } finally {
        client.end()
    }
})