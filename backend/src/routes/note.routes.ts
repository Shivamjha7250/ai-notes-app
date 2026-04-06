import { Hono } from "hono";
import authMiddleware from "../middleware/auth.middleware";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.controller";

const noteRouter = new Hono();

noteRouter.use("*", authMiddleware);

noteRouter.post("/", createNote);
noteRouter.get("/", getNotes);
noteRouter.put("/:id", updateNote);
noteRouter.delete("/:id", deleteNote);

export default noteRouter;