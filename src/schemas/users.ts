import { UsersTC } from "../models/users"
import {
  addUserResolvers,
  setUserPubSub,
  onUpdateUser,
  subscriptions
} from "../resolvers/users"

import { isAuthenticated, generateToken } from "../helpers/auth"

addUserResolvers(UsersTC)

const usersQuery = {
  userById: UsersTC.getResolver("findById", [isAuthenticated]),
  userLogin: UsersTC.getResolver("userLogin", [generateToken]),
  // userByIds: UsersTC.mongooseResolvers.findByIds(),
  // userOne: UsersTC.mongooseResolvers.findOne(),
  getUsers: UsersTC.getResolver('findMany')
  // userCount: UsersTC.mongooseResolvers.count(),
  // userConnection: UsersTC.mongooseResolvers.connection(),
  // userPagination: UsersTC.mongooseResolvers.pagination(),
}
const usersMutation = {
  userCreateOne: UsersTC.getResolver("createOne"),
  userUpdateById: UsersTC.getResolver("updateById", [onUpdateUser])
  // userCreateMany: UsersTC.mongooseResolvers.createMany(),
  // userUpdateOne: UsersTC.mongooseResolvers.updateOne(),
  // userUpdateMany: UsersTC.mongooseResolvers.updateMany(),
  // userRemoveById: UsersTC.mongooseResolvers.removeById(),
  // userRemoveOne: UsersTC.mongooseResolvers.removeOne(),
  // userRemoveMany: UsersTC.mongooseResolvers.removeMany()
}

const usersSubscription = {
  userUpdated: subscriptions.userUpdated
}

export { usersQuery, usersMutation, usersSubscription, setUserPubSub }
