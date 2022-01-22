"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors"));
const router_1 = __importDefault(require("@koa/router"));
const bodyParser = require("koa-bodyparser");
const koaSession = require("koa-session");
const mongo_1 = __importDefault(require("./config/mongo"));
const author_1 = __importDefault(require("./routes/author"));
const goods_1 = __importDefault(require("./routes/goods"));
const categories_1 = __importDefault(require("./routes/categories"));
const order_1 = __importDefault(require("./routes/order"));
const upload_1 = __importDefault(require("./routes/upload"));
const logged_check_1 = __importDefault(require("./middleware/logged_check"));
const schedule_1 = require("./service/schedule");
const app = new koa_1.default();
const router = new router_1.default();
app.keys = ['WUpEUF9TRVJWRVJfQ01T'];
const ROUTER_PREFIX = '/cms/yjdp/api';
mongo_1.default.connect();
app.use((0, cors_1.default)({ credentials: true }));
app.use(bodyParser());
app.use(koaSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    signed: true,
    rolling: true,
    secure: false,
}, app));
router.prefix(ROUTER_PREFIX);
router.use('/author', author_1.default);
router.use('/goods', logged_check_1.default, goods_1.default);
router.use('/upload', logged_check_1.default, upload_1.default);
router.use('/category', logged_check_1.default, categories_1.default);
router.use('/order', order_1.default);
app.use(router.routes()).use(router.allowedMethods());
(0, schedule_1.clearFilesSchedule)();
(0, schedule_1.physicallyDeleteGoodsSchedule)();
const port = 7716;
const host = 'localhost';
app.listen(port, () => {
    console.log(`yjdp cms server running at ${host}:${port}`);
});
