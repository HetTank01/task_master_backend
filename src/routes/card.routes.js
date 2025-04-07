import { Router } from "express";
import CardController from "../controllers/card.controller.js";
import { validateCard } from "../middlewares/validate.js";

const router = Router()
const cardController = new CardController()

router.get("/", cardController.getAll)
router.post("/", validateCard, cardController.create)
router.patch("/:id", validateCard, cardController.update)
router.delete("/:id", cardController.delete)
router.put("/:cardId/move", cardController.moveCardsBetweenList)

export default router