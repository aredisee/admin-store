import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Tampilkan daftar stok produk
router.get("/", (req, res) => {
  db.query(
    `SELECT s.id, p.nama AS nama_produk, s.jumlah 
     FROM stok s JOIN produk p ON s.produk_id = p.id`,
    (err, result) => {
      if (err) throw err;
      res.render("stocks", { title: "Stok Produk", stocks: result });
    }
  );
});

export default router;
