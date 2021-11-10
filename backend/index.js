import express from "express";
import cors from "cors";
import db from "./db/db.js";
import dotenv from "dotenv";
import client from "./routes/client.js";
import supplier from "./routes/supplier.js";
import book from "./routes/book.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/client", client);
app.use("/api/supplier", supplier);
app.use("/api/book", book);

app.listen(process.env.PORT, () =>
  console.log("Backend server running on port :" + process.env.PORT)
);

db.dbConnection();
