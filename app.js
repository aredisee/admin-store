import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import { db } from "./db.js";
import productRoutes from "./routes/productRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/products", productRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/stocks", stockRoutes);

app.get("/", (req, res) => {
  res.render("index", { title: "Dashboard" });
});

app.listen(5000, () => console.log("🚀 http://localhost:5000"));
