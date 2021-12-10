import { SchemaComposer } from "graphql-compose"
import {
  usersQuery,
  usersMutation,
  usersSubscription,
  setPubSubs
} from "./users"

const schemaComposer = new SchemaComposer()
schemaComposer.Query.addFields({
  ...usersQuery
})
schemaComposer.Mutation.addFields({
  ...usersMutation
})
schemaComposer.Subscription.addFields({
  ...usersSubscription
})
const graphqlSchema = schemaComposer.buildSchema()

const setPubSub = (pubsub: any) => {
  setPubSubs(pubsub)
}

export { graphqlSchema, setPubSub }
