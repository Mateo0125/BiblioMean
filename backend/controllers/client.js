import client from "../models/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const registerClient = async (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.password)
    return res.status(400).send("Information missing");
  // decirle al profe acerca del ! en el existingClient
  const existingClient = await client.findOne({ email: req.body.email });
  if (existingClient) return res.status(400).send("This email already exist");

  const hash = await bcrypt.hash(req.body.password, 10);

  const clientSchema = new client({
    name: req.body.name,
    email: req.body.email,
    password: hash,
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

  let pass = "";

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10);
  } else {
    const clientFind = await client.findOne({ email: req.body.email });
    pass = clientFind.password;
  }

  const existingClient = await client.findOne({
    email: req.body.email,
    name: req.body.name,
    clientId: req.body.clientId,
  });
  if (existingClient)
    return res.status(400).send("You haven't made any change");

  const clientUpdate = await client.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    clientId: req.body.clientId,
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

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Incomplete data" });

  const clientLogin = await client.findOne({ email: req.body.email });
  if (!clientLogin)
    return res.status(400).send({ message: "wrong password or email" });

  const hash = await bcrypt.compare(req.body.password, clientLogin.password);

  if (!hash)
    return res.status(400).send({ message: "Wrong email or password" });

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: clientLogin._id,
          name: clientLogin.name,
          clientId: clientLogin.clientId,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (e) {
    return res.status(200).send({ message: "Login error" }, e);
  }
};

export default {
  registerClient,
  listClient,
  findClient,
  updateClient,
  deleteClient,
  login,
};
