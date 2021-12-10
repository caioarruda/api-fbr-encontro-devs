import { SchemaComposer } from "graphql-compose"
import { usersQuery, usersMutation } from "./users"

const schemaComposer = new SchemaComposer()
schemaComposer.Query.addFields({
  ...usersQuery,
})
schemaComposer.Mutation.addFields({
  ...usersMutation,
})
const graphqlSchema = schemaComposer.buildSchema()

export default graphqlSchema
