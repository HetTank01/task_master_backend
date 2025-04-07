import ListMaster from "../models/ListMaster.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { sendResponse } from "../utils/responseHandler.js";
import CardMaster from "../models/CardMaster.js";

class ListController {
    getAll = asyncHandler(async (req, res) => {
        const { boardId } = req.query

        const lists = await ListMaster.findAll({
            where: { BoardMasterId: boardId },
            order: [['position', "ASC"]]
        })

        return sendResponse(res, {
            statusCode: 200,
            data: lists,
            message: "lists Information"
        })
    })

    create = asyncHandler(async (req, res) => {
        const list = await ListMaster.create(req.body)

        return sendResponse(res, {
            statusCode: 201,
            data: list,
            message: "List Created Successfully"
        })
    })

    update = asyncHandler(async (req, res) => {
        const { id } = req.params

        const isListExist = await ListMaster.findByPk(id)

        if (!isListExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "List not found"
            })
        }

        await isListExist.update(req.body)

        sendResponse(res, {
            statusCode: 200,
            data: isListExist,
            message: "List Updated Successfully"
        })
    })

    delete = asyncHandler(async (req, res) => {
        const { id } = req.params

        const isListExist = await ListMaster.findByPk(id)

        if (!isListExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "List not found"
            })
        }

        const cards = await CardMaster.findAll({ where: { ListMasterId: isListExist.id } })

        await Promise.all(cards.map(card => card.destroy()))
        await isListExist.destroy()

        sendResponse(res, {
            statusCode: 200,
            message: "List Deleted Successfully"
        })
    })

    updatedCardPosition = asyncHandler(async (req, res) => {
        const { listId } = req.params
        const { cards } = req.body

        await Promise.all(cards.map(async (card) => {
            await CardMaster.update(
                { position: card.position },
                { where: { id: card.id, ListMasterId: listId } }
            )
        }))

        sendResponse(res, {
            statusCode: 200,
            message: "position changed successfully"
        })
    })
}

export default ListController