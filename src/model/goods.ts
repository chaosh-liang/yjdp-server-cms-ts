import { Schema, model } from 'mongoose'
import type { IGoods } from '@/@types/typing'

const schema = new Schema<IGoods>(
  {
    name_zh: String, // String is shorthand for {type: String}
    name_en: String,
    price: Number,
    home_banner: Boolean,
    home_display: Boolean,
    desc_zh: String,
    desc_en: String,
    icon_url: String,
    series_id: Schema.Types.ObjectId,
    category_id: Schema.Types.ObjectId,
    desc_url: [String],
    banner_url: [String],
    deleted: Number, // 0：未删除 1：逻辑删除，显示在回收站（可恢复）
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
)

// model 名称须与数据库中的表明相同，不区分大小写。但是表名必须以 s 结尾
// 如果 model 名称与表名不相同，则查不到数据，且不报错
export default model<IGoods>('goods', schema)
