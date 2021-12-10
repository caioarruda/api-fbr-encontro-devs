import { ObjectTypeComposer } from "graphql-compose"
import { withFilter } from "graphql-subscriptions"
import * as mongoose from "mongoose"
import { Document } from "mongoose"
import { Users } from "../models/users"
let pubsub: any
const setUserPubSub = (ps: any) => {
  pubsub = ps
}

const onUpdateUser = async (
  resolve: any,
  source: any,
  args: any,
  context: any,
  info: any
) => {
  const res = await resolve(source, args, context, info)

  await pubsub.publish("USER_UPDATED", res?.record)
  return res
}

type UserSubscriptions = {
  userUpdated: any
}
const subscriptions: UserSubscriptions = {} as UserSubscriptions

const addUserResolvers = (
  UsersTC: ObjectTypeComposer<Document<any, any, any>, any>
) => {
  UsersTC.addResolver({
    name: "userLogin",
    description: "Efetuar acesso ao sistema",
    type: UsersTC.getType(),
    args: {
      email: "String",
      senha: "String"
    },
    resolve: async (args: any) => {
      const { email, senha } = args
      const user = await Users.findOne({ email, senha })
      if (!user) {
        return null
      }
      return user
    }
  })
  subscriptions.userUpdated = {
    type: UsersTC.getType(),
    args: {
      user: "String"
    },
    resolve: (payload: any) => payload,
    subscribe: withFilter(
      () => pubsub.asyncIterator("USER_UPDATED"),
      (payload, args) => {
        return String(payload?._id) === args.user
      }
    )
  }
}
export { addUserResolvers, setUserPubSub, onUpdateUser, subscriptions }
