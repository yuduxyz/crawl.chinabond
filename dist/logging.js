"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
// Partial: 将类型中的属性都设为可选
function outputLog(data, thrownError) {
    if (config_1.config.prettyLog) {
        console.log(`${data.statusCode} ${data.method} ${data.url} - ${data.responseTime}ms`);
        if (thrownError) {
            console.error(thrownError);
        }
    }
    else if (data.statusCode < 400) {
        process.stdout.write(JSON.stringify(data) + '\n');
    }
    else {
        process.stderr.write(JSON.stringify(data) + '\n');
    }
}
async function logger(ctx, next) {
    const start = new Date().getMilliseconds();
    const logData = {
        method: ctx.method,
        url: ctx.url,
        query: ctx.query,
        remoteAddress: ctx.request.ip,
        host: ctx.headers['host'],
        userAgent: ctx.headers['user-agent'],
    };
    let errorThrown = null;
    try {
        await next();
        logData.statusCode = ctx.status;
    }
    catch (e) {
        errorThrown = e;
        logData.errorMessage = e.message;
        logData.errorStack = e.stack;
        logData.statusCode = e.status || 500;
        if (e.data) {
            logData.data = e.data;
        }
    }
    logData.responseTime = new Date().getMilliseconds() - start;
    outputLog(logData, errorThrown);
    if (errorThrown) {
        throw errorThrown;
    }
}
exports.logger = logger;
//# sourceMappingURL=logging.js.map