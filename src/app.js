import express from "express"
import loaders from "./loaders/index.js"

const app = express()

loaders(app)

export default app