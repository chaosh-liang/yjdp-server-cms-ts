"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const orders_1 = __importDefault(require("../model/orders"));
const router = new router_1.default();
router.post('/', async (ctx) => {
    const { request: { body: { page_size = 10, page_index = 1, q }, }, } = ctx;
    const keyword = q?.replace(/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|]/g, '\\$&');
    const regExp = new RegExp(keyword, 'i');
    try {
        const total = await orders_1.default.countDocuments({
            $or: [
                { nick_name: { $regex: regExp } },
                { desc: { $regex: regExp } },
            ],
        });
        const res = await orders_1.default
            .aggregate()
            .match({
            $or: [
                { nick_name: { $regex: regExp } },
                { desc: { $regex: regExp } },
            ],
        })
            .project({
            _id: 0,
            user_id: 1,
            goods_id: 1,
            nick_name: 1,
            goods_name: 1,
            gcount: 1,
            status: 1,
            actual_pay: 1,
            currency_unit: 1,
            create_time: 1,
            order_id: '$_id',
        })
            .sort({ create_time: -1 })
            .skip(page_size * (page_index - 1))
            .limit(page_size);
        ctx.body = {
            error_code: '00',
            data: { res, total, page_index, page_size },
            error_msg: 'Success',
        };
    }
    catch (error) {
        console.log('/order error => ', error);
        ctx.body = { error_code: 500, data: null, error_msg: error };
    }
});
router.put('/update', async (ctx, done) => {
    const { request: { body: params, body: { order_id }, }, } = ctx;
    let returnInfo = null;
    try {
        await orders_1.default.updateOne({ _id: order_id }, { status: params.status });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/order/update error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
exports.default = router.routes();
