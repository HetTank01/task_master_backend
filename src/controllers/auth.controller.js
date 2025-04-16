import { asyncHandler } from "../middlewares/asyncHandler.js";
import { generateToken } from "../middlewares/auth.js";
import UserMaster from "../models/UserMaster.js";
import { sendResponse } from "../utils/responseHandler.js";
import bcrypt from "bcrypt"

class AuthController {
    register = asyncHandler(async (req, res) => {
        const isUserExist = await UserMaster.findOne({ where: { email: req.body.email } });
    
        if (isUserExist) {
            return sendResponse(res, {
                statusCode: 400,
                message: "Email Already Exist",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
        const user = await UserMaster.create({
            ...req.body,
            password: hashedPassword,
        });

        const token = generateToken(user);

        sendResponse(res, {
            statusCode: 201,
            data: {
                id: user.id,
                email: user.email,
                token: token,
            },
            message: "User Registered and Logged In Successfully",
        });
    });
    

    login = asyncHandler(async (req, res) => {
        const isUserExist = await UserMaster.findOne({ where: { email: req.body.email } })

        if (!isUserExist) {
            return sendResponse(res, {
                statusCode: 400,
                message: "Invlid Credentials"
            })
        }

        const isMatch = await bcrypt.compare(req.body.password, isUserExist.dataValues.password)

        if (!isMatch) {
            return sendResponse(res, {
                statusCode: 400,
                message: "Invalid credentials"
            })
        }

        const token = generateToken(isUserExist)

        return sendResponse(res, {
            statusCode: 200,
            data: { id: isUserExist.id, email: isUserExist.email, token },
            message: "Login Successful"
        })
    })
}

export default AuthController