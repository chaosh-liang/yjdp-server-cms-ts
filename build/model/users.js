"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user_name: String,
    password: String,
    role: Number,
}, { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } });
exports.default = (0, mongoose_1.model)('cmsusers', schema);
