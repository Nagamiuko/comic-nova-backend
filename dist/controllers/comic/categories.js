"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany();
        res.status(200).json({ success: true, data: categories });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getAllCategories = getAllCategories;
// GET /categories/:id
const getCategoryById = async (req, res) => {
    const { cId } = req.query;
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
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getCategoryById = getCategoryById;
// POST /categories
const createCategory = async (req, res) => {
    const { cid, name, icon, count, color } = req.body;
    try {
        const newCategory = await prisma.categories.create({
            data: { cid, name, icon, count, color },
        });
        res.status(201).json({ success: true, data: newCategory });
    }
    catch (err) {
        res.status(400).json({ success: false, message: "Invalid data" });
    }
};
exports.createCategory = createCategory;
// PUT /categories/:id
const updateCategory = async (req, res) => {
    const { name, icon, count, color } = req.body;
    const { cId } = req.query;
    try {
        const updated = await prisma.categories.update({
            where: { id: cId },
            data: { name, icon, count, color },
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        res.status(404).json({ success: false, message: "Category not found" });
    }
};
exports.updateCategory = updateCategory;
// DELETE /categories/:id
const deleteCategory = async (req, res) => {
    const { cId } = req.query;
    try {
        await prisma.categories.delete({
            where: { id: cId },
        });
        res.json({ success: true, message: "Deleted successfully" });
    }
    catch (err) {
        res.status(404).json({ success: false, message: "Category not found" });
    }
};
exports.deleteCategory = deleteCategory;
