import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Tampilkan semua pembelian + daftar produk
router.get("/", (req, res) => {
  const queryPembelian = `
    SELECT p.id, pr.nama AS nama_produk, p.jumlah, p.total, p.status, p.tanggal
    FROM pembelian p
    JOIN produk pr ON p.produk_id = pr.id
    ORDER BY p.tanggal DESC
  `;

  db.query(queryPembelian, (err, purchases) => {
    if (err) throw err;

    // 🔹 Ambil semua produk untuk form dropdown
    db.query("SELECT * FROM produk", (err, products) => {
      if (err) throw err;

      // 🔹 Kirim ke EJS
      res.render("purchases", {
        title: "Data Pembelian",
        purchases,
        products, // ✅ dikirim ke EJS
      });
    });
  });
});

// Tambah pembelian
router.post("/add", (req, res) => {
  const { produk_id, jumlah } = req.body;

  // Ambil harga produk
  db.query("SELECT harga FROM produk WHERE id = ?", [produk_id], (err, result) => {
    if (err) throw err;
    const harga = result[0].harga;
    const total = harga * jumlah;

    // Simpan ke tabel pembelian
    db.query(
      "INSERT INTO pembelian (produk_id, jumlah, total) VALUES (?, ?, ?)",
      [produk_id, jumlah, total],
      (err) => {
        if (err) throw err;

        // Kurangi stok
        db.query(
          "UPDATE stok SET jumlah = jumlah - ? WHERE produk_id = ?",
          [jumlah, produk_id],
          (err2) => {
            if (err2) throw err2;
            res.redirect("/purchases");
          }
        );
      }
    );
  });
});

// Cancel pembelian
router.get("/cancel/:id", (req, res) => {
  const { id } = req.params;

  // Ambil data pembelian dulu
  db.query("SELECT * FROM pembelian WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect("/purchases");

    const pembelian = result[0];
    const { produk_id, jumlah } = pembelian;

    // Update status pembelian jadi cancel
    db.query("UPDATE pembelian SET status = 'cancel' WHERE id = ?", [id], (err2) => {
      if (err2) throw err2;

      // Tambahkan stok kembali
      db.query(
        "UPDATE stok SET jumlah = jumlah + ? WHERE produk_id = ?",
        [jumlah, produk_id],
        (err3) => {
          if (err3) throw err3;
          res.redirect("/purchases");
        }
      );
    });
  });
});

export default router;
