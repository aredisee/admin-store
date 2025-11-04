import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Menampilkan semua produk
router.get("/", (req, res) => {
  db.query("SELECT * FROM produk", (err, result) => {
    if (err) throw err;
    res.render("products", { title: "Daftar Produk", products: result });
  });
});

export default router;
