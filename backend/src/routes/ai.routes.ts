import { Hono } from "hono";
import { processAiAction } from "../controllers/ai.controller";
const aiRouter = new Hono();
aiRouter.post("/process", processAiAction);
export default aiRouter;