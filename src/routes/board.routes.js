import { Router } from "express";
import BoardController from "../controllers/board.controller.js";
import { validateBoard } from "../middlewares/validate.js";

const router = Router()
const boardController = new BoardController()

router.get("/", boardController.getAll)
router.post("/", validateBoard, boardController.create)
router.put("/:id", validateBoard, boardController.update)
router.delete("/:id", boardController.delete)

router.post("/share", boardController.shareBoard)
router.post("/validate", boardController.validateInvite)
router.post("/accept", boardController.acceptInvite)

router.get("/shared-with-you", boardController.getBoardSharedWithYou)
router.put("/:boardId/lists/update-positions", boardController.updatedListPosition)

export default router