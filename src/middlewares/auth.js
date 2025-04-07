import jwt from "jsonwebtoken"
import { asyncHandler } from "./asyncHandler.js"
import { sendResponse } from "../utils/responseHandler.js"
import { configDotenv } from "dotenv"

configDotenv()

const generateToken = (data) => {
    try {
        return jwt.sign(
            { id: data.id, email: data.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        )
    } catch (error) {
        console.error("Token generation error:", error.message);
        throw new Error("Failed to generate token");
    }
}

const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendResponse(res, {
                statusCode: 401,
                message: "No token provided or invalid token format",
            });
        }

        const token = authHeader.split(" ")[1]

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return sendResponse(res, {
                        statusCode: 401,
                        message: "Token has expired",
                    });
                }

                return sendResponse(res, {
                    statusCode: 403,
                    message: "Invalid token",
                });
            }

            console.log("decoded", decoded)
            req.user = decoded;
            next();
        })
    } catch (error) {
        return sendResponse(res, {
            statusCode: 500,
            message: "Error verifying token",
        });
    }
})

export { generateToken, verifyToken }