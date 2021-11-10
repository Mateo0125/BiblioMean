import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  registerDate: { type: Date, default: Date.now },
  dbStatus: { type: Boolean, default: true },
});

const client = mongoose.model("clients", clientSchema);

export default client;
