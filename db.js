import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "store_system"
});

db.connect(err => {
  if (err) {
    console.error("Koneksi ke db gagal:", err);
  } else {
    console.log("Terhubung ke database!");
  }
});
