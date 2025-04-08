import express from "express"
import cors from "cors"
import routes from "../routes/index.js"
import helmet from "helmet"
import "../models/index.js"
import { Server } from "socket.io"


export default (app, server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.on("connection", (socket) => {
        socket.on("card:add", (data) => {
            console.log("added card", data)
            socket.broadcast.emit("card:added", data)
        })

        socket.on("list:add", (data) => { // emit the event from frontend
            console.log("added list", data)
            socket.broadcast.emit("list:added", data) // see the updated data emitted to other users
        })

        socket.on("comment:add", (data) => {
            console.log("Comment Added", data)
            socket.broadcast.emit("comment:added", data)
        })
    })

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet());
    app.use(express.static("public"));

    app.use("/api/v1", routes)
}

