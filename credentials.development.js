/* eslint-disable no-unused-vars */
const { credentials } = require('./config');
/* eslint-enable no-unused-vars */
module.exports = {
    cookieSecret: 'i want to believe',
    sendgrid: {
        user: 'apikey',
        password: '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',
    },
    mongo: {
        connectionString: 'mongodb+srv://nurbek01:A08A11A20r@meadowlarktravelvacatio.rmgun8y.mongodb.net/?retryWrites=true&w=majority'
    },
    postgres: {
        connectionString: 'postgres://bnpnhrwp:mUevx6_gh7bulrZwaUztHoSS9ouqo7Lm@john.db.elephantsql.com/bnpnhrwp'
    },
    redis: {
        url: 'redis://default:yYGfuwEqCAxGio7NwMXVvfo75oPitlzc@redis-19177.c212.ap-south-1-1.ec2.cloud.redislabs.com:19177'
    },
};
