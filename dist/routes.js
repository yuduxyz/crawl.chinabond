"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const crawl_1 = require("./controller/crawl");
const router = new Router();
router.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
});
router.get('/test', async (ctx) => {
    ctx.status = 201;
    ctx.body = 'test';
});
router.get('/chinabond/getFile', async (ctx) => {
    const query = ctx.request.query;
    const data = await crawl_1.default(query);
    ctx.body = data;
    ctx.set('Content-disposition', 'attachmane; filename=download.zip');
});
exports.routes = router.routes();
//# sourceMappingURL=routes.js.map