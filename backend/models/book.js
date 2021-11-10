import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  publicationYear: String,
  registerDate: { type: Date, default: Date.now },
  pages: Number,
  genre: String,
  price: Number,
});

const book = mongoose.model("books", bookSchema);

export default book;
