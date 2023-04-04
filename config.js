/* eslint-disable no-undef */
const env = process.env.NODE_ENV || 'development';
/* eslint-enable no-undef */
const credentials = require(`./.credentials.${env}`);
module.exports = { credentials };
