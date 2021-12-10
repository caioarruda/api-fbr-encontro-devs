/* eslint-disable no-console */
import dotenv from "dotenv"
const result = dotenv.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
})

if (result.error) {
  throw result.error
}

import { ApolloServer } from "apollo-server-express"
import graphqlSchema from "./schemas/index"
import mongoose from "mongoose"
import express from "express"
import http from "http"
import https from "https"
import fs from "fs"
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled
} from "apollo-server-core"


const prod: boolean = process.env.NODE_ENV === "prod"

const url = process.env.URL || ""
const KEY_PATH = process.env.KEY_PATH || ""
const CRT_PATH = process.env.CRT_PATH || ""

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB connected successfully")
  })
  .catch((e) => {
    console.error("Error while connecting to MongoDB", e)
  })

async function startApolloServer() {
  const app = express()
  const options = {
    key: prod ? fs.readFileSync(KEY_PATH)?.toString() : "",
    cert: prod ? fs.readFileSync(CRT_PATH)?.toString() : "",
  }

  const httpServer = prod ? https.createServer(options, app) : http.createServer(app)
  const apollo = new ApolloServer({
    schema: graphqlSchema,
    plugins: [
      prod
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  })

  await apollo.start()
  apollo.applyMiddleware({ app })
  await httpServer.listen(4000, "0.0.0.0")
  console.log(`🚀 Server ready at http${prod ? "s" : ""}://localhost:4000${apollo.graphqlPath}`)
}

startApolloServer()
