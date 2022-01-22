"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const mongodb_1 = require("mongodb");
const goods_1 = __importDefault(require("../model/goods"));
const series_1 = __importDefault(require("../model/series"));
const categories_1 = __importDefault(require("../model/categories"));
const router = new router_1.default();
router.get('/', async (ctx) => {
    const res = await categories_1.default
        .aggregate()
        .lookup({
        from: 'series',
        localField: '_id',
        foreignField: 'category_id',
        as: 'series_data',
    })
        .sort({ no: 1 });
    ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' };
});
router.get('/s/:id', async (ctx) => {
    const req = ctx.request;
    const res = await series_1.default
        .aggregate()
        .match({ category_id: new mongodb_1.ObjectId(req.params.id) })
        .lookup({
        from: 'goods',
        localField: '_id',
        foreignField: 'series_id',
        as: 'goods_data',
    })
        .project({
        _id: 1,
        name: 1,
        icon_url: 1,
        no: 1,
        desc: 1,
        category_id: 1,
        create_time: 1,
        update_time: 1,
        goods_count: {
            $size: {
                $cond: [{ $isArray: '$goods_data' }, '$goods_data', []],
            },
        },
    })
        .sort({ no: 1 });
    ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' };
});
router.post('/add', async (ctx) => {
    const { request: { body: { name, desc, no }, }, } = ctx;
    let returnInfo = null;
    try {
        await categories_1.default.create({
            name,
            desc,
            no,
        });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/category/add error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
router.post('/s/add', async (ctx) => {
    const { request: { body: { name, desc, no, icon_url, category_id }, }, } = ctx;
    let returnInfo = null;
    try {
        await series_1.default.create({
            name,
            desc,
            no,
            icon_url,
            category_id: new mongodb_1.ObjectId(category_id),
        });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/category/s/add error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
router.delete('/delete', async (ctx) => {
    const { request: { body: { id }, }, } = ctx;
    if (id === void 0) {
        ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
        return;
    }
    let returnInfo = null;
    try {
        const series_count = await series_1.default.countDocuments({ category_id: id });
        if (series_count !== 0) {
            ctx.body = {
                error_code: 92,
                data: null,
                error_msg: '存在系列，不能删除',
            };
            return;
        }
        await categories_1.default.deleteOne({ _id: id });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/category/delete error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
router.delete('/s/delete', async (ctx) => {
    const { request: { body: { id }, }, } = ctx;
    if (id === void 0) {
        ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
        return;
    }
    let returnInfo = null;
    try {
        const goods_count = await goods_1.default.countDocuments({ series_id: id });
        if (goods_count !== 0) {
            ctx.body = {
                error_code: 92,
                data: null,
                error_msg: '存在商品，不能删除',
            };
            return;
        }
        await series_1.default.deleteOne({ _id: id });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/category/s/delete error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
router.put('/update', async (ctx) => {
    const { request: { body: params, body: { _id }, }, } = ctx;
    if (_id === void 0) {
        ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
        return;
    }
    let returnInfo = null;
    Reflect.deleteProperty(params, '_id');
    try {
        await categories_1.default.updateOne({ _id }, { ...params });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/category/update error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
router.put('/s/update', async (ctx) => {
    const { request: { body: params, body: { _id }, }, } = ctx;
    if (_id === void 0) {
        ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
        return;
    }
    let returnInfo = null;
    Reflect.deleteProperty(params, '_id');
    if (Reflect.has(params, 'category_id')) {
        params.category_id = new mongodb_1.ObjectId(params.category_id);
    }
    try {
        const res = await series_1.default.updateOne({ _id }, { ...params });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/category/s/update error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
exports.default = router.routes();
