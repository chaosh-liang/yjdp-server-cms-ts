"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.physicallyDeleteGoodsSchedule = exports.clearFilesSchedule = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const goods_1 = __importDefault(require("../model/goods"));
const series_1 = __importDefault(require("../model/series"));
const schedule = require("node-schedule");
const PUBLIC_URL = 'yjdp_public';
const UPLOAD_URL = 'upload';
let fileDirectory = path_1.default.resolve(`D:\\${PUBLIC_URL}\\${UPLOAD_URL}`);
if (process.env.NODE_ENV === 'production') {
    fileDirectory = path_1.default.resolve(`/opt/material/server/${PUBLIC_URL}/${UPLOAD_URL}`);
}
const clearUselessPicture = async () => {
    const allGoods = await goods_1.default.find();
    const allSeries = await series_1.default.find();
    const dbGoodsPicture = allGoods
        .map((goods) => {
        const { icon_url, banner_url, desc_url } = goods;
        const [, icon_file_name] = icon_url.match(/upload\/(.+)/) ?? [
            ,
            'icon_file_default_name',
        ];
        const banner_file_name = banner_url
            .filter((url) => url)
            .map((url) => url.match(/upload\/(.+)/)?.[1])
            .flat();
        const desc_file_name = desc_url
            .filter((url) => url)
            .map((url) => url.match(/upload\/(.+)/)?.[1])
            .flat();
        return [icon_file_name, ...banner_file_name, ...desc_file_name];
    })
        .flat();
    const dbSeriesPicture = allSeries
        .map((series) => {
        const { icon_url } = series;
        const [, icon_file_name] = icon_url.match(/upload\/(.+)/) ?? [
            ,
            'icon_file_default_name',
        ];
        return icon_file_name;
    });
    const dbPictureSet = new Set([...dbGoodsPicture, ...dbSeriesPicture]);
    fs_1.default.readdir(fileDirectory, (error, files) => {
        if (error)
            throw error;
        const redundantFiles = files.filter((file) => !dbPictureSet.has(file));
        redundantFiles.forEach((file) => {
            fs_1.default.unlinkSync(path_1.default.join(fileDirectory, file));
        });
    });
};
const physicallyDeleteGoods = async () => {
    const recycleGoods = await goods_1.default.find({ deleted: 1 });
    if (recycleGoods.length) {
        const shallbeDeletedGoods = recycleGoods.filter((goods) => {
            const deletedDate = new Date(goods.update_time).getTime();
            const now = Date.now();
            const diff = now - deletedDate;
            const days = ~~(diff / 1000 / 60 / 60 / 24);
            return days >= 30;
        });
        if (shallbeDeletedGoods.length) {
            const ids = shallbeDeletedGoods.map((goods) => goods._id?.toString());
            try {
                goods_1.default.deleteMany({ deleted: 1, _id: { $in: ids } }).exec();
            }
            catch (error) {
                console.log('physicallyDeleteGoods/delete error => ', error);
            }
        }
    }
};
const clearFilesSchedule = () => {
    const clearFilesJob = schedule.scheduleJob({ hour: 2, minute: 10, second: 10, dayOfWeek: 1 }, () => {
        clearUselessPicture();
    });
};
exports.clearFilesSchedule = clearFilesSchedule;
const physicallyDeleteGoodsSchedule = () => {
    const physicallyDeleteGoodsJob = schedule.scheduleJob({ hour: 1, minute: 10, second: 10, date: 1 }, () => {
        physicallyDeleteGoods();
    });
};
exports.physicallyDeleteGoodsSchedule = physicallyDeleteGoodsSchedule;
