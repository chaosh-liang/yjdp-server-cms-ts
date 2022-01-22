"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const mongodb_1 = require("mongodb");
const goods_1 = __importDefault(require("../model/goods"));
const router = new router_1.default();
router.post('/', async (ctx) => {
    const { request: { body: { page_size = 10, page_index = 1, q }, }, } = ctx;
    const keyword = q?.replace(/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|]/g, '\\$&');
    let condition = [];
    const regExp = new RegExp(keyword, 'i');
    if (/^\w{24}$/.test(q)) {
        condition = [
            { name: { $regex: regExp } },
            { desc: { $regex: regExp } },
            { series_id: new mongodb_1.ObjectId(q) },
        ];
    }
    else {
        condition = [
            { name: { $regex: regExp } },
            { desc: { $regex: regExp } },
        ];
    }
    try {
        const total = await goods_1.default.countDocuments({
            deleted: 0,
            $or: condition,
        });
        const res = await goods_1.default
            .aggregate()
            .match({
            deleted: 0,
            $or: condition,
        })
            .lookup({
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category_data',
        })
            .lookup({
            from: 'series',
            localField: 'series_id',
            foreignField: '_id',
            as: 'series_data',
        })
            .unwind('category_data', 'series_data')
            .project({
            _id: 1,
            name: 1,
            discount_price: 1,
            discount_threshold: 1,
            price: 1,
            home_banner: 1,
            home_display: 1,
            desc: 1,
            currency_unit: 1,
            count_unit: 1,
            icon_url: 1,
            series_id: 1,
            category_id: 1,
            desc_url: 1,
            banner_url: 1,
            category_data: 1,
            category_name: '$category_data.name',
            series_name: '$series_data.name',
            create_time: 1,
            update_time: 1,
        })
            .sort({ update_time: -1 })
            .skip(page_size * (page_index - 1))
            .limit(page_size);
        ctx.body = {
            error_code: '00',
            data: { res, total, page_index, page_size },
            error_msg: 'Success',
        };
    }
    catch (error) {
        console.log('/goods error => ', error);
        ctx.body = { error_code: 500, data: null, error_msg: error };
    }
});
router.post('/expired', async (ctx) => {
    const { request: { body: { page_size = 10, page_index = 1 }, }, } = ctx;
    const total = await goods_1.default.countDocuments({ deleted: 1 });
    const res = await goods_1.default
        .find({ deleted: 1 })
        .sort({ update_time: -1 })
        .skip(page_size * (page_index - 1))
        .limit(page_size);
    ctx.body = {
        error_code: '00',
        data: { res, total, page_index, page_size },
        error_msg: 'Success',
    };
});
router.post('/add', async (ctx) => {
    const { request: { body: { name, banner_url, category_id, desc, discount_price, discount_threshold, icon_url, price, series_id, desc_url, home_banner, home_display, currency_unit, count_unit, }, }, } = ctx;
    let returnInfo = null;
    try {
        await goods_1.default.create({
            name,
            desc,
            price,
            icon_url,
            desc_url,
            deleted: 0,
            banner_url,
            count_unit,
            home_banner,
            home_display,
            currency_unit,
            discount_price,
            discount_threshold,
            series_id: new mongodb_1.ObjectId(series_id),
            category_id: new mongodb_1.ObjectId(category_id),
        });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/goods/add error => ', error);
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
    if (Reflect.has(params, 'series_id')) {
        params.series_id = new mongodb_1.ObjectId(params.series_id);
    }
    if (Reflect.has(params, 'category_id')) {
        params.category_id = new mongodb_1.ObjectId(params.category_id);
    }
    try {
        await goods_1.default.updateOne({ _id }, { ...params });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/goods/update error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
router.delete('/delete', async (ctx) => {
    const { request: { body: { ids }, }, } = ctx;
    if (ids === void 0) {
        ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
        return;
    }
    let returnInfo = null;
    try {
        await goods_1.default.updateMany({ _id: { $in: ids } }, { deleted: 1 });
        returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    }
    catch (error) {
        console.log('/goods/delete error => ', error);
        returnInfo = { error_code: 500, data: null, error_msg: error };
    }
    ctx.body = returnInfo;
});
exports.default = router.routes();
