"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: String,
    discount_price: Number,
    discount_threshold: Number,
    price: Number,
    home_banner: Boolean,
    home_display: Boolean,
    desc: String,
    currency_unit: String,
    count_unit: String,
    icon_url: String,
    series_id: mongoose_1.Schema.Types.ObjectId,
    category_id: mongoose_1.Schema.Types.ObjectId,
    desc_url: [String],
    banner_url: [String],
    deleted: Number,
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } });
exports.default = (0, mongoose_1.model)('goods', schema);
