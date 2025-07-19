import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /categories/:id
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { cId } = req.query as any;
  try {
    const category = await prisma.categories.findUnique({
      where: { id: cId },
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /categories
export const createCategory = async (req: Request, res: Response) => {
  const { cid, name, icon, count, color } = req.body;
  try {
    const newCategory = await prisma.categories.create({
      data: { cid, name, icon, count, color },
    });
    res.status(201).json({ success: true, data: newCategory });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid data" });
  }
};

// PUT /categories/:id
export const updateCategory = async (req: Request, res: Response) => {
  const { name, icon, count, color } = req.body;
  const { cId } = req.query as any;
  try {
    const updated = await prisma.categories.update({
      where: { id: cId },
      data: { name, icon, count, color },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(404).json({ success: false, message: "Category not found" });
  }
};

// DELETE /categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
  const { cId } = req.query as any;
  try {
    await prisma.categories.delete({
      where: { id: cId },
    });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(404).json({ success: false, message: "Category not found" });
  }
};
