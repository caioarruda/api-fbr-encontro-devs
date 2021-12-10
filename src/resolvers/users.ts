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
  userUpdated: any,
  userCreated: any
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

  UsersTC.addResolver({
    name: "getAccountID",
    description: "Buscar id da conta do usuário na pier",
    type: "Int",
    args: {
      email: "String"
    },
    resolve: async (payload: any) => {
      const { email, senha } = payload.args
      const idconta = 120456
      return idconta
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
  subscriptions.userCreated = {
    type: UsersTC.getType(),
    args: {},
    resolve: (payload: any) => payload,
    subscribe: withFilter(
      () => pubsub.asyncIterator("USER_CREATED"),
      (payload, args) => {
        return true
      }
    )
  }
}
export { addUserResolvers, setUserPubSub, subscriptions }
