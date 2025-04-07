import http from "http"
import express from "express"
import loaders from "./loaders/index.js"

const app = express()
const server = http.createServer(app)

loaders(app, server)

export { app, server }