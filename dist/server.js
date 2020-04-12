"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const config_1 = require("./config");
const logging_1 = require("./middlewares/logging");
const catchError_1 = require("./middlewares/catchError");
const routes_1 = require("./routes");
const app = new Koa();
app.use(logging_1.logger);
app.use(catchError_1.catchError);
app.use(routes_1.routes);
app.listen(config_1.config.port);
console.log('server running on port 3008');
//# sourceMappingURL=server.js.map