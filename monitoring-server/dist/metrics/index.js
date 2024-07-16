"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = void 0;
const requestCount_1 = require("./requestCount");
const activeRequests_1 = require("./activeRequests");
const requestTime_1 = require("./requestTime");
const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    activeRequests_1.activeRequestsGauge.inc();
    res.on('finish', function () {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Request took ${endTime - startTime}ms`);
        requestCount_1.requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
        requestTime_1.httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);
        activeRequests_1.activeRequestsGauge.dec();
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
