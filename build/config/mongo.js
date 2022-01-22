"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DB_URL = 'mongodb://lcs:up2021@localhost/dev';
exports.default = {
    connect: () => {
        (0, mongoose_1.connect)(DB_URL)
            .then(() => {
            console.log('[MongoDB connection] SUCCESS');
        })
            .catch((error) => {
            console.log('[MongoDB connection] ERROR: ', error);
        });
    },
};
