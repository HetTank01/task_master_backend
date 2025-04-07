import { Op } from "sequelize";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { verifyToken } from "../middlewares/auth.js";
import BoardMaster from "../models/BoardMaster.js";
import BoardUser from "../models/BoardUser.js";
import CardMaster from "../models/CardMaster.js";
import ListMaster from "../models/ListMaster.js";
import UserMaster from "../models/UserMaster.js";
import { sendMail } from "../utils/mail.js";
import { sendResponse } from "../utils/responseHandler.js";
import jwt, { decode } from "jsonwebtoken"

class BoardController {
    getAll = asyncHandler(async (req, res) => {
        const { userId } = req.query

        const boards = await BoardMaster.findAll({
            where: { UserMasterId: userId }, include: [
                {
                    model: ListMaster
                }
            ]
        })

        return sendResponse(res, {
            statusCode: 200,
            data: boards,
            message: "Boards Information"
        })
    })

    create = asyncHandler(async (req, res) => {
        const { UserMasterId } = req.body;

        const isUserExist = await UserMaster.findByPk(UserMasterId);

        if (!isUserExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "User Not Found"
            });
        }

        const board = await BoardMaster.create(req.body);

        const freshUser = await UserMaster.findByPk(UserMasterId);

        let currentBoards = freshUser.shared_boards || [];

        if (!Array.isArray(currentBoards)) {
            currentBoards = [];
        }

        const boardId = Number(board.id) || board.id;

        if (!currentBoards.includes(boardId)) {
            currentBoards.push(boardId);
        }

        await UserMaster.update(
            { shared_boards: currentBoards },
            { where: { id: UserMasterId } }
        );

        return sendResponse(res, {
            statusCode: 201,
            data: board,
            message: "Board Created Successfully"
        });
    });


    update = asyncHandler(async (req, res) => {
        const { id } = req.params

        const isBoardExist = await BoardMaster.findByPk(id)

        if (!isBoardExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Board not found"
            })
        }

        await isBoardExist.update(req.body)

        sendResponse(res, {
            statusCode: 200,
            data: isBoardExist,
            message: "Board Updated Successfully"
        })
    })

    delete = asyncHandler(async (req, res) => {
        const { id } = req.params;

        const isBoardExist = await BoardMaster.findByPk(id);

        if (!isBoardExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Board not found"
            });
        }

        const allUsers = await UserMaster.findAll();

        const filteredUsers = allUsers.map(async (user) => {
            const sharedBoards = user.shared_boards || [];

            if (sharedBoards.includes(isBoardExist.id)) {
                const updatedSharedBoards = sharedBoards.filter((boardId) => boardId !== isBoardExist.id);

                await UserMaster.update(
                    { shared_boards: updatedSharedBoards },
                    { where: { id: user.id } }
                );
            }
        });

        await Promise.all(filteredUsers);

        const lists = await ListMaster.findAll({ where: { BoardMasterId: id } });
        const listIds = lists.map((list) => list.id);

        if (listIds.length > 0) {
            const cards = await CardMaster.findAll({ where: { ListMasterId: listIds } });
            await Promise.all(cards.map(card => card.destroy()));
        }

        await Promise.all(lists.map(list => list.destroy()));
        await isBoardExist.destroy();

        sendResponse(res, {
            statusCode: 200,
            message: "Board Deleted Successfully"
        });
    });

    getBoardSharedWithYou = asyncHandler(async (req, res) => {
        const { UserMasterId } = req.query;

        const isUserExist = await UserMaster.findByPk(UserMasterId);

        if (!isUserExist) {
            return sendResponse(res, {
                statusCode: 404,
                message: "User Not Found"
            });
        }

        const sharedBoards = isUserExist.shared_boards || [];

        if (!Array.isArray(sharedBoards) || sharedBoards.length === 0) {
            return sendResponse(res, {
                statusCode: 200,
                data: [],
                message: "No shared boards found."
            });
        }

        const findBoards = await BoardMaster.findAll({
            where: {
                id: {
                    [Op.in]: sharedBoards
                }
            },
            include: [{
                model: UserMaster,
                // will not include board create by current user
                where: {
                    id: {
                        [Op.ne]: UserMasterId
                    }
                }
            }, { model: ListMaster, include: [{ model: CardMaster }] }]
        });

        return sendResponse(res, {
            statusCode: 200,
            data: findBoards,
            message: "Boards fetched successfully"
        });
    });


    shareBoard = asyncHandler(async (req, res) => {
        const { BoardMasterId, email, role } = req.body

        const user = await UserMaster.findOne({ where: { email: email } })

        if (!user) {
            return sendResponse(res, {
                statusCode: 404,
                message: "User Not Found"
            })
        }

        const board = await BoardMaster.findByPk(BoardMasterId)

        if (!board) {
            return sendResponse(res, {
                statusCode: 404,
                message: "Board Not Found"
            })
        }

        if (user.shared_boards.includes(Number(BoardMasterId)) || user.shared_boards.includes(BoardMasterId)) {
            return sendResponse(res, {
                statusCode: 400,
                message: "User already has access to this board"
            })
        }

        const token = jwt.sign(
            { BoardMasterId: BoardMasterId, email, role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "24h" }
        )

        const inviteLink = `http://localhost:5173/invite?token=${token}`

        await sendMail(email, "You have been invited to a board", inviteLink)

        return sendResponse(res, {
            statusCode: 200,
            message: `Invitation sent to ${email}`,
            inviteLink,
        })
    })

    validateInvite = asyncHandler(async (req, res) => {
        const { token } = req.body

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            return sendResponse(res, {
                statusCode: 200,
                message: "Token is valid",
                data: decoded
            })
        } catch (error) {
            console.log(error)
            return sendResponse(res, {
                statusCode: 200,
                message: "Token is expired or Invalid",
            })
        }
    })

    acceptInvite = asyncHandler(async (req, res) => {
        const { token } = req.body

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const { BoardMasterId, email, role } = decoded

            const user = await UserMaster.findOne({ where: { email } })

            if (!user) {
                return sendResponse(res, {
                    statusCode: 404,
                    message: "User Not Found"
                })
            }

            let sharedBoard = user.shared_boards

            if (!Array.isArray(sharedBoard)) {
                sharedBoard = []
            }

            if (sharedBoard.includes(Number(BoardMasterId)) || sharedBoard.includes(BoardMasterId)) {
                return sendResponse(res, {
                    statusCode: 400,
                    message: "User already has access to this board"
                })
            }

            sharedBoard.push(BoardMasterId)

            const updated = await UserMaster.update(
                { shared_boards: sharedBoard },
                { where: { id: user.id } }
            )

            sendResponse(res, {
                statusCode: 200,
                message: "Access Granted"
            })
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return sendResponse(res, {
                    statusCode: 401,
                    message: "Token has expired. Request a new invite."
                });
            }

            return sendResponse(res, {
                statusCode: 401,
                message: "Invalid token."
            });
        }

    })

    updatedListPosition = asyncHandler(async (req, res) => {
        const { boardId } = req.params
        const { lists } = req.body

        await Promise.all(lists.map(async (list) => {
            await ListMaster.update(
                { position: list.position },
                { where: { id: list.id, BoardMasterId: boardId } }
            )
        }))

        sendResponse(res, {
            statusCode: 200,
            message: "position changed successfully"
        })
    })


}

export default BoardController