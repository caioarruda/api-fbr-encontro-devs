import { UsersTC } from "../models/users"
import addUserResolvers from "../resolvers/users"

import {
    isAuthenticated,
    generateToken
} from '../helpers/auth'

addUserResolvers(UsersTC)
const usersQuery = {
    userById: UsersTC.getResolver('findById', [isAuthenticated]),
    // userByIds: UsersTC.mongooseResolvers.findByIds(),
    // userOne: UsersTC.mongooseResolvers.findOne(),
    // userMany: UsersTC.mongooseResolvers.findMany(),
    // userCount: UsersTC.mongooseResolvers.count(),
    // userConnection: UsersTC.mongooseResolvers.connection(),
    // userPagination: UsersTC.mongooseResolvers.pagination(),
    userLogin: UsersTC.getResolver('userLogin', [generateToken])
}
const usersMutation = {
    userCreateOne: UsersTC.getResolver('createOne')
    // userCreateMany: UsersTC.mongooseResolvers.createMany(),
    // userUpdateById: UsersTC.mongooseResolvers.updateById(),
    // userUpdateOne: UsersTC.mongooseResolvers.updateOne(),
    // userUpdateMany: UsersTC.mongooseResolvers.updateMany(),
    // userRemoveById: UsersTC.mongooseResolvers.removeById(),
    // userRemoveOne: UsersTC.mongooseResolvers.removeOne(),
    // userRemoveMany: UsersTC.mongooseResolvers.removeMany()
}

export { usersQuery, usersMutation }
