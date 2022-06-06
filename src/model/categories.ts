import { Schema, model } from 'mongoose'
import type { ICategory } from '@/@types/typing'

const schema = new Schema<ICategory>(
  {
    name_zh: String,
    name_en: String,
    desc: String, // 不向客户展示的内容只要中文就行
    no: Number, // 序号
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
)

export default model<ICategory>('categories', schema)

/* {
  _id: 'a125342f145',
  name: '手机'
} */
