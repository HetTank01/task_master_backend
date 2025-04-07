import { Router } from "express";
import ListController from "../controllers/list.controller.js";
import { validateList } from "../middlewares/validate.js";

const router = Router()
const listController = new ListController()

router.get("/", listController.getAll)
router.post("/", validateList, listController.create)
router.put("/:id", validateList, listController.update)
router.delete("/:id", listController.delete)
router.put("/:listId/cards/update-positions", listController.updatedCardPosition)

export default router