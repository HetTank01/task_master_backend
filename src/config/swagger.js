import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Trello Clone API",
        version: "1.0.0",
        description: "API documentation for the Trello Clone",
    },
    servers: [{ url: "http://localhost:3000/api/v1" }],
};

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.routes.js"]
}

const swaggerSpec = swaggerJSDoc(options)


export default (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}