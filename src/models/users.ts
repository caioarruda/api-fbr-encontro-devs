import mongoose, { Schema } from "mongoose"
import { composeMongoose, composeWithMongoose } from "graphql-compose-mongoose"


const usersSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    nome: { type: String, required: true },
    token: String
  },
  { timestamps: true }
)
const Users = mongoose.model("Users", usersSchema, "users")
const customizationOptions = {}
const UsersTC = composeWithMongoose(mongoose.model("Users", usersSchema))
// const UsersTC = composeMongoose(Users, customizationOptions)

export { Users, UsersTC }
