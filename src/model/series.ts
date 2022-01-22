import { Schema, model } from 'mongoose'
import type { ISeries } from '@/@types/typing'

const schema = new Schema<ISeries>(
  {
    name: String,
    icon_url: String,
    no: Number, // 序号
    desc: String,
    category_id: Schema.Types.ObjectId,
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
)

export default model<ISeries>('series', schema)
