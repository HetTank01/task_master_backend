import { asyncHandler } from "../middlewares/asyncHandler.js";
import CardMaster from "../models/CardMaster.js";
import ListMaster from "../models/ListMaster.js";
import { sendResponse } from "../utils/responseHandler.js";

class CardController {
    getAll = asyncHandler(async (req, res) => {
        const { listId } = req.query

        const cards = await CardMaster.findAll({ where: { ListMasterId: listId } })

        return sendResponse(res, {
            statusCode: 200,
            data: cards,
            message: "Cards Information"
        })
    })

    create = asyncHandler(async (req, res) => {
        const card = await CardMaster.create(req.body)

        return sendResponse(res, {
            statusCode: 201,
            data: card,
            message: "Card Created Successfully"
        })
    })

    update = asyncHandler(async (req, res) => {
        const { id } = req.params

        console.log("body", req.body)

        const isCardExist = await CardMaster.findByPk(id)

        console.log("iscardexist\n", isCardExist)

        if (!isCardExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Card not found"
            })
        }

        await isCardExist.update(req.body)

        sendResponse(res, {
            statusCode: 200,
            data: isCardExist,
            message: "Card Updated Successfully"
        })
    })

    delete = asyncHandler(async (req, res) => {
        const { id } = req.params

        const isCardExist = await CardMaster.findByPk(id)

        if (!isCardExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Card not found"
            })
        }

        await isCardExist.destroy()

        sendResponse(res, {
            statusCode: 200,
            message: "Card Deleted Successfully"
        })
    })

    moveCardsBetweenList = asyncHandler(async (req, res) => {
        const { cardId } = req.params
        const { targetListId, position } = req.body

        const isListExist = await ListMaster.findByPk(targetListId)

        if (!isListExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "List not found"
            })
        }

        await CardMaster.update(
            { ListMasterId: targetListId, position: position },
            { where: { id: cardId } }
        )

        sendResponse(res, {
            statusCode: 200,
            message: "Card moved successfully between lists"
        });
    })
}

export default CardController