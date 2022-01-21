import { Schema, model } from 'mongoose'
import type { IUser } from '../../@types/typing'

// Schema
const schema = new Schema<IUser>(
  {
    // _id: Schema.Types.ObjectId,
    user_name: String,
    password: String,
    role: Number, // 1: root 2: admin 3: visitor
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
)

export default model<IUser>('cmsusers', schema)
