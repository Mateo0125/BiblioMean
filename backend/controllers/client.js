import client from "../models/client.js";

const registerClient = async (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.password)
    return res.status(400).send("Information missing");
  // decirle al profe acerca del ! en el existingClient
  const existingClient = await client.findOne({ email: req.body.email });
  if (existingClient) return res.status(400).send("This email already exist");

  const clientSchema = new client({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dbStatus: true,
  });
  const result = await clientSchema.save();
  if (!result) return res.status(400).send("Failed in client registration");

  return res.status(200).send({ result });
};

const listClient = async (req, res) => {
  const clientSchema = await client.find();
  if (!clientSchema || clientSchema.length == 0)
    return res.status(400).send("Client's list is empty");
  return res.status(200).send({ clientSchema });
};
const findClient = async (req, res) => {
  const clientId = await client.findOne({ _id: req.params["_id"] });
  return !clientId
    ? res.status(400).send("No se encontraron resultados")
    : res.status(200).send({ clientId });
};
const updateClient = async (req, res) => {
  if (!req.body.name || !req.body.email)
    return res.status(400).send("Information missing");

  const existingClient = await client.findOne({ name: req.body.email });
  if (existingClient) return res.status(400).send("This email already exist");

  const clientUpdate = await client.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
  });

  return !clientUpdate
    ? res.status(400).send("Error editing client's information")
    : res.status(200).send({ clientUpdate });
};
const deleteClient = async (req, res) => {
  const clientDelete = await client.findByIdAndDelete({
    _id: req.params["_id"],
  });

  return !clientDelete
    ? res.status(400).send("Client not found")
    : res.status(200).send("Client deleted");
};

export default {
  registerClient,
  listClient,
  findClient,
  updateClient,
  deleteClient,
};
