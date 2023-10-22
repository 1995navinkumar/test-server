import { v4 as uuid } from 'uuid';
import logger from './logger.mjs';

export const httpLogMiddleware = (req, res, next) => {
    const reqId = uuid();
    const startTime = performance.now();

    const reqInfo = {
        url: req.url,
        'X-Request-Id': reqId
    };

    logger.log({
        message: `Processing Request - ${reqId}`,
        context: reqInfo,
    });

    res.on('finish', function onFinish() {
        const responseTime = Math.ceil(performance.now() - startTime);
        const resInfo = { statusCode: res.statusCode, message: res.statusMessage };
        logger.log({
            message: `Request ${reqId} took ${responseTime}ms to finish`,
            context: { ...resInfo },
        });
    });

    next();
};