
const winston = require('winston')

module.exports = function(config) {
    const logger = winston.createLogger({
        level: config.loglevel,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.File({filename: 'irsjpy_server.log'})
        ]
    })
    if(config.environment !== 'prod') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }))
    }
    return logger
}

