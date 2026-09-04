import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {createTask,deleteTask, getTaskById, getTasks, updateTask} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;