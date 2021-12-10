import { SchemaComposer } from "graphql-compose"
import {
  usersQuery,
  usersMutation,
  usersSubscription,
  setUserPubSub
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
  setUserPubSub(pubsub)
}

export { graphqlSchema, setPubSub }
