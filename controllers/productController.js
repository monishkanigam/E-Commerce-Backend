import { success } from 'zod';
import { pool } from '../config/db.js';


export const createProducts = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const result = await pool.query("insert into products(name,description,price,category,stock)values($1,$2,$3,$4,$5)returning *", [name, description, price, category, stock]);
        res.status(201).json(
            result.rows[0]);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error creating product:", error
        });
    };
};


export const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query("select * from products");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error fetching products", error
        });
    };
};


export const getProductByID = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("select * from products where id=$1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "product not found",
            });
        }
        res.json(result.rows[0]);
    } catch (error) {
        return res.status(400).json({ message: "error fetching product" });
    };
};


export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        console.log("id:",id);
        const { name, description, price, category, stock } = req.body;
        console.log("req.body:",req.body);
        const result = await pool.query("update products set name=$1,description=$2,price=$3,category=$4,stock=$5,updatedAt=NOW() where id=$6 returning *", [name, description, price, category, stock, id]);
        console.log("result:",result);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error updating product"
        });
    };
};


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("delete from products where id=$1 returning *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "product not found",
            });
        }
        res.json({
            success: true,
            message: "product deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error deleting product",
        });
    };
};