import { asyncHandler } from "../middlewares/asyncHandler.js";
import CardMaster from "../models/CardMaster.js";
import CommentMaster from "../models/CommentMaster.js";
import UserMaster from "../models/UserMaster.js";
import { sendResponse } from "../utils/responseHandler.js";

class CommentController {
    getAll = asyncHandler(async (req, res) => {
        const { cardId } = req.query

        const comments = await CommentMaster.findAll({
            where: { CardMasterId: cardId, ParentId: null },
            include: [
                { model: UserMaster },
                {
                    model: CommentMaster,
                    as: "replies",
                    include: [{
                        model: UserMaster
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        sendResponse(res, {
            statusCode: 200,
            data: comments,
            message: "Comments retrived"
        })
    })

    create = asyncHandler(async (req, res) => {
        const comment = await CommentMaster.create(req.body)

        sendResponse(res, {
            statusCode: 201,
            data: comment,
            message: "Comment Created Successfully"
        })
    })

    update = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { CardMasterId } = req.body

        const isCardExist = await CardMaster.findByPk(CardMasterId)

        if (!isCardExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Card Not Found"
            })
        }

        const isCommentExist = await CommentMaster.findByPk(id)

        if (!isCommentExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Comment Not Found"
            })
        }

        await isCommentExist.update(req.body)

        sendResponse(res, {
            statusCode: 200,
            message: "Comment Updated Successfully"
        })
    })

    delete = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { CardMasterId } = req.query

        const isCardExist = await CardMaster.findByPk(CardMasterId)

        if (!isCardExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Card Not Found"
            })
        }

        const isCommentExist = await CommentMaster.findByPk(id)

        if (!isCommentExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Comment Not Found"
            })
        }

        await isCommentExist.destroy()

        sendResponse(res, {
            statusCode: 200,
            message: "Comment Deleted Successfully"
        })
    })

    createReply = asyncHandler(async (req, res) => {
        const { description, UserMasterId, ParentId } = req.body

        const isParentCommentExist = await CommentMaster.findByPk(ParentId)

        if (!isParentCommentExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Parent Comment Not Exist"
            })
        }

        // ParentId = comment's id
        const reply = await CommentMaster.create({
            description,
            UserMasterId,
            ParentId,
            CardMasterId: isParentCommentExist.CardMasterId
        })

        sendResponse(res, {
            statusCode: 201,
            data: reply,
            message: "Reply added successfully"
        })
    })
}

export default CommentController