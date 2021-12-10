
import { ObjectTypeComposer } from "graphql-compose"
import { Document } from "mongoose"
import { Users } from "../models/users"

const addUserResolvers = (UsersTC: ObjectTypeComposer<Document<any, any, any>, any>) => {
  UsersTC.addResolver({
    name: "userLogin",
    description: "Efetuar acesso ao sistema",
    type: UsersTC.getType(),
    args: {
      email: 'String',
      senha: 'String',
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
}
export default addUserResolvers