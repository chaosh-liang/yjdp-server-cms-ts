"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: String,
    icon_url: String,
    no: Number,
    desc: String,
    category_id: mongoose_1.Schema.Types.ObjectId,
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } });
exports.default = (0, mongoose_1.model)('series', schema);
