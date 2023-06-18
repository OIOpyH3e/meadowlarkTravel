const { Pool } = require('pg')
const _ = require('lodash')

// const credentials = require('./credentials')

const connectionString = 'postgres://bnpnhrwp:mUevx6_gh7bulrZwaUztHoSS9ouqo7Lm@john.db.elephantsql.com/bnpnhrwp'
const pool = new Pool({ connectionString })

module.exports = {
    getVacations: async () => {
        const { rows } = await pool.query('SELECT * FROM VACATIONS')
        return rows.map(row => {
            const vacation = _.mapKeys(row, (v, k) => _.camelCase(k))
            vacation.price = parseFloat(vacation.price.replace(/^\$/, ''))
            vacation.location = {
                search: vacation.locationSearch,
                coordinates: {
                    lat: vacation.locationLat,
                    lng: vacation.locationLng,
                },
            }
            return vacation
        })
    },
    addVacationInSeasonListener: async (email, sku) => {
        await pool.query(
            'INSERT INTO vacation_in_season_listeners (email, sku) ' +
            'VALUES ($1, $2) ' +
            'OM CONFLICT DA NOTHING',
            [email, sku]
        )
    },
}