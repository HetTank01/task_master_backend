import express from "express"
import cors from "cors"
import routes from "../routes/index.js"
import helmet from "helmet"
import "../models/index.js"

export default (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet());
    app.use(express.static("public"));

    app.use("/api/v1", routes)
}

