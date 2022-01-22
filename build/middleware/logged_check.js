"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (ctx, next) => {
    if (ctx.session?.isNew)
        ctx.response.status = 401;
    await next();
};
