import { Schema, model } from 'mongoose'
import type { ICategory } from '@/@types/typing'

const schema = new Schema<ICategory>(
  {
    name: String,
    desc: String,
    no: Number, // 序号
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
)

export default model<ICategory>('categories', schema)

/* {
  _id: 'a125342f145',
  name: '手机'
} */
