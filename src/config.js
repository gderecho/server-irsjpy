
// credit to https://github.com/santiq/bulletproof-nodejs/blob/master/src/config/index.ts

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

module.exports = {
    port: parseInt(process.env.IRSJPY_SERVER_PORT, 10) || 3001,
    databaseurl: process.env.IRSJPY_DATABASE_URL,
    loglevel: process.env.IRSJPY_LOGLEVEL || 'silly',
    environment: process.env.NODE_ENV,
    mailer_client_id: process.env.GOOGLE_MAILER_CLIENT_ID,
    mailer_refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
    mailer_secret: process.env.GOOGLE_MAILER_SECRET,
}

// check for undefined
for(const key in module.exports) {
    if(module.exports.hasOwnProperty(key)) {
        if(typeof module.exports[key] === 'undefined') {
            throw new Error("Configuration error -- ".concat(key).concat(" is undefined"))
        }
    }
}
