import { Context } from "hono";
import prisma from "../lib/prisma";

// 1. Create Note
export const createNote = async (c: Context) => {
  try {
    const user = c.get("user");
    const userId = user?.id || user?.userId;
    if (!userId) return c.json({ message: "Unauthorized" }, 401);

    const { title, content } = await c.req.json();
    const note = await prisma.note.create({
      data: { title, content, userId }
    });
    return c.json(note, 201);
  } catch (error: any) {
    return c.json({ message: error.message }, 500);
  }
};

// 2. Update Note
export const updateNote = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const { title, content } = await c.req.json();
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content }
    });
    return c.json(updatedNote);
  } catch (error: any) {
    return c.json({ message: error.message }, 500);
  }
};

// 3. Delete Note
export const deleteNote = async (c: Context) => {
  try {
    const id = c.req.param("id");
    await prisma.note.delete({ where: { id } });
    return c.json({ message: "Note deleted" });
  } catch (error: any) {
    return c.json({ message: error.message }, 500);
  }
};

// 4. Get All Notes
export const getNotes = async (c: Context) => {
  try {
    const user = c.get("user");
    const userId = user?.id || user?.userId;
    const notes = await prisma.note.findMany({ where: { userId } });
    return c.json(notes);
  } catch (error: any) {
    return c.json({ message: error.message }, 500);
  }
};