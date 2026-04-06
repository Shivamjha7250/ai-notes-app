import jwt from "jsonwebtoken";
import type { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    c.set("user", decoded);

    await next();
  } catch (err) {
    return c.json({ message: "Invalid token" }, 401);
  }
};

export default authMiddleware;