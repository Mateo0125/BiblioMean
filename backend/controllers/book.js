import book from "../models/book.js";

// post con postman
const registerBook = async (req, res) => {
  if (!req.body.name || !req.body.author || !req.body.publicationYear)
    return res.status(400).send("Information missing");

  const existingBook = await book.findOne({ name: req.body.name });
  if (existingBook) return res.status(400).send("This books already exist");

  const bookSchema = new book({
    name: req.body.name,
    author: req.body.author,
    publicationYear: req.body.publicationYear,
    dbStatus: true,
  });
  const result = await bookSchema.save();
  if (!result) return res.status(400).send("Failed to register book");

  return res.status(200).send({ result });
};

// get con postman
const listBook = async (req, res) => {
  const bookSchema = await book.find();
  if (!bookSchema || bookSchema.length == 0)
    return res.status(400).send("List's book is empty");
  return res.status(200).send({ bookSchema });
};
// todo lo que es con find se hace internamente
const findBook = async (req, res) => {
  const bookId = await book.findOne({ _id: req.params["_id"] });
  return !bookId
    ? res.status(400).send("No se encontraron resultados")
    : res.status(200).send({ bookId });
};

const updateBook = async (req, res) => {
  if (!req.body.name || !req.body.author)
    return res.status(400).send("Information missing");

  const existingBook = await book.findOne({
    name: req.body.name,
    author: req.body.author,
  });
  if (existingBook) return res.status(400).send("This books already exist");

  const bookUpdate = await book.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    author: req.body.author,
  });

  return !bookUpdate
    ? res.status(400).send("Error editing book's information")
    : res.status(200).send({ bookUpdate });
};

const deleteBook = async (req, res) => {
  const bookDelete = await book.findByIdAndDelete({ _id: req.params["_id"] });

  return !bookDelete
    ? res.status(400).send("Book not found")
    : res.status(200).send("Book deleted");
};

export default { registerBook, listBook, findBook, updateBook, deleteBook };
