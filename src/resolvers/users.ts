import { ObjectTypeComposer } from "graphql-compose"
import { withFilter } from "graphql-subscriptions"
import { Document } from "mongoose"
import { Users } from "../models/users"
let pubsub: any
const setUserPubSub = (ps: any) => {
  pubsub = ps
}

const subscriptions: UserSubscriptions = {} as UserSubscriptions


type UserSubscriptions = {
  userUpdated: any
}


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
    resolve: async (payload: any) => {
      const { email, senha } = payload.args
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
export { addUserResolvers, setUserPubSub, subscriptions }
