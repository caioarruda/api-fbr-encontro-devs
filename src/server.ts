/* eslint-disable no-console */
import dotenv from "dotenv"
const result = dotenv.config({
  path: process.env.NODE_ENV?.trim() === "dev" ? ".env.dev" : ".env"
})

if (result.error) {
  throw result.error
}

import { ApolloServer } from "apollo-server-express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import http from "http"
import https from "https"
import fs from "fs"
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled
} from "apollo-server-core"
import { execute, subscribe } from "graphql"
import { PubSub } from "graphql-subscriptions"
import { SubscriptionServer } from "subscriptions-transport-ws"
import { graphqlSchema, setPubSub } from "./schemas/index"
import expressPlayground from "graphql-playground-middleware-express"

const prod: boolean = process.env.NODE_ENV?.trim() === "prod"

const url = process.env.URL || ""
const KEY_PATH = process.env.KEY_PATH || ""
const CRT_PATH = process.env.CRT_PATH || ""
const PORT = process.env.PORT || 4000

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB connected successfully")
  })
  .catch((e) => {
    console.error("Error while connecting to MongoDB", e)
  })

async function startApolloServer() {
  const options = {
    key: prod ? fs.readFileSync(KEY_PATH)?.toString() : "",
    cert: prod ? fs.readFileSync(CRT_PATH)?.toString() : ""
  }
  const app = express()

  app.use(cors())
  app.use("/graphql", bodyParser.json())

  const apollo = new ApolloServer({
    schema: graphqlSchema,
    context: ({ req }) => {
      return {
        startTime: Date.now(),
        token: req.headers["authorization"]
      }
    },
    plugins: [
      prod
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  })

  await apollo.start()
  apollo.applyMiddleware({ app })

  const pubsub = new PubSub()
  setPubSub(pubsub)

  const httpServer = prod
    ? https.createServer(options, app)
    : http.createServer(app)

  httpServer.listen(Number(PORT), "0.0.0.0", async () => {
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema: graphqlSchema,
        onConnect: (ctx: any) => {
          console.log("Connect", ctx)
        }
      },
      {
        server: httpServer,
        path: "/subscriptions"
      }
    )
    app.get(
      "/playground",
      expressPlayground({
        endpoint: apollo.graphqlPath,
        subscriptionEndpoint: "/subscriptions"
      })
    )
  })
  console.log(
    prod,
    `🚀 Server ready at http${prod ? "s" : ""}://localhost:${String(PORT) + apollo.graphqlPath}`
  )
}

startApolloServer()
