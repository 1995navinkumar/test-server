import { v4 as uuid } from 'uuid';
import { configLocalStorage } from './localStorage.mjs';
import { createLogger } from './logger.mjs';

const logger = createLogger("httpLogger");

export const httpLogMiddleware = (req, res, next) => {
    const reqId = uuid();
    const startTime = performance.now();

    const reqInfo = {
        url: req.url,
        host: req.hostname,
        request_id: reqId
    };

    logger.info(`Processing Request - ${reqId}`, reqInfo);

    res.on('finish', function onFinish() {
        const responseTime = Math.ceil(performance.now() - startTime);
        const resInfo = { statusCode: res.statusCode, message: res.statusMessage };
        logger.info(`Request ${reqId} took ${responseTime}ms to finish`, { ...resInfo, responseTime });
    });

    configLocalStorage.run(reqInfo, next);
};