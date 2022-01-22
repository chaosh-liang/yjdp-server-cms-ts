"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: String,
    desc: String,
    no: Number,
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } });
exports.default = (0, mongoose_1.model)('categories', schema);
