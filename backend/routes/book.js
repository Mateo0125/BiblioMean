import express from "express";
import book from "../controllers/book.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";

const router = express.Router();

// http://localhost:3001/api/book/registerBook
router.post("/registerBook", auth, admin, book.registerBook);
router.get("/listBook", auth, book.listBook);
router.get("/findBook/:_id", auth, book.findBook);
router.put("/updateBook", auth, admin, book.updateBook);
router.delete("/deleteBook/:_id", auth, admin, book.deleteBook);

export default router;
