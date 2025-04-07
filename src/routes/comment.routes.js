import { Router } from "express";
import CommentController from "../controllers/comment.controller.js";

const router = Router()
const commentController = new CommentController()

router.get("/", commentController.getAll)
router.post("/", commentController.create)
router.put("/:id", commentController.update)
router.delete("/:id", commentController.delete)
router.post("/reply", commentController.createReply)

export default router