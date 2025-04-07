import { asyncHandler } from "../middlewares/asyncHandler.js";
import UserMaster from "../models/UserMaster.js";
import { sendResponse } from "../utils/responseHandler.js";

class UserController {
    getAll = asyncHandler(async (req, res) => {
        const users = await UserMaster.findAll()

        sendResponse(res, {
            statusCode: 200,
            data: users,
            message: "Users Information"
        })
    })
}

export default UserController