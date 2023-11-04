const commonMeta = {

}

function compileLog(level = 'info', logger) {
    const stream = level === 'error' ? console.error : console.log;
    return (message, userMeta) => {
        stream(JSON.stringify({
            message: level === 'error' ? `${getStack(message)} ${getCause(message)}` : message,
            application: "test-server",
            level,
            logger,
            meta: {
                ...commonMeta,
                ...userMeta,
            },
            timestamp: new Date().toUTCString()
        }))
    }
}

export function createLogger(logger) {
    return {
        info: compileLog('info', logger),
        warn: compileLog('warning', logger),
        debug: compileLog('debug', logger),
        error: compileLog('error', logger),
    };
}

function getStack(err) {
    return err instanceof Error && err.stack ? err.stack : err.toString();
}

function getCause(err) {
    if (err instanceof Error && err.cause) {
        return err.cause.stack || err.cause.toString();
    }
    return err.toString();
}

export default createLogger('Default Logger');

/* 

const logLine = {
    level: "debug | info | warning | error",
    timestamp: "UTC time",
    module: "module|component|function",
    application: "test-server",
    message: "message or error",
    meta: {
        request_id: "uuid",
        path: "req path",
        host: "hostname",
        cookies: {
            key: "val"
        },
        statusCode: "5xx | 2xx | 3xx"
    }
}

level: 
provide it as method - logger.info() , logger.warning(), logger.error()
timestamp:
while sending it
module:
while initializing the logger - compose
logger.createLogger(moduleName);
application:
const props
message : 
        sent by user (string)
        logger.info(message)
        logger.error(error, context)
    meta : 
        populated by reqLogger
        populated by user
        logger.info(message, { meta }); // will be merged to common meta props

*/