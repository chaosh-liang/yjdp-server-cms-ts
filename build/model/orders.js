"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user_id: mongoose_1.Schema.Types.ObjectId,
    goods_id: mongoose_1.Schema.Types.ObjectId,
    goods_name: String,
    gcount: Number,
    status: Number,
    actual_pay: Number,
    desc: String,
    icon_url: String,
    currency_unit: String,
    nick_name: String,
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } });
exports.default = (0, mongoose_1.model)('orders', schema);
