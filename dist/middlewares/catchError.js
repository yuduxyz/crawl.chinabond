"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function catchError(ctx, next) {
    try {
        await next();
    }
    catch (e) {
        console.error(e, 'catch you----');
        ctx.status = 500;
        ctx.body = e.message;
    }
}
exports.catchError = catchError;
//# sourceMappingURL=catchError.js.map