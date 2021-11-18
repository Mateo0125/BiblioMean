import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  let token = req.header("Authorization");
  if (!token)
    res.status(400).send({ message: "Authorization denied:There's not token" });
  // esta funcion lo que hace es dividir el bearer y el token entonces el [1] guarda solo el valor en la posicion 1
  token = token.split(" ")[1];
  if (!token)
    res.status(400).send({ message: "Authorization denied:There's not token" });

  try {
    req.user = jwt.verify(token, process.env.SK_JWT);
    next();
  } catch (e) {
    return res
      .status(400)
      .send({ message: "Authorization denied: Invalid token" });
  }
};

export default auth;
