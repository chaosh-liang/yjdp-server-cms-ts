import { Schema, model } from 'mongoose'
import type { ISeries } from '@/@types/typing'

const schema = new Schema<ISeries>(
  {
    name_zh: String,
    name_en: String,
    icon_url: String,
    no: Number, // 序号
    desc: String, // 不向客户展示的内容只要中文就行
    category_id: Schema.Types.ObjectId,
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
)

export default model<ISeries>('series', schema)
