
// credit to https://github.com/santiq/bulletproof-nodejs/blob/master/src/config/index.ts

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

module.exports = {
    port: parseInt(process.env.IRSJPY_SERVER_PORT, 10) || 3000,
    databaseurl: process.env.IRSJPY_DATABASE_URL,
    loglevel: process.env.IRSJPY_LOGLEVEL || 'silly',
    environment: process.env.NODE_ENV
}

// check for undefined
for(const key in module.exports) {
    if(module.exports.hasOwnProperty(key)) {
        if(typeof module.exports[key] === 'undefined') {
            throw new Error("Configuration error -- ".concat(key).concat(" is undefined"))
        }
    }
}
