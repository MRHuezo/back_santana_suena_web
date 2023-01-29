const UserCtrl = {};
const modelUsuario = require("../models/Usuario");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

UserCtrl.createUsuario = async (req, res) => {
  try {
    //const { data } = req.body;

    const data = {
      email: "",
      password: "",
      id_sede: "",
      rol: "ADMIN_PRINCIPAL",
    };
    const usuario = await new modelUsuario(data);
    const usuarios = await modelUsuario.find();
    res.status(200).json({ usuarios: sedes });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

UserCtrl.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuarioBase = await modelUsuario.findOne({ email: email }).populate("id_sede");

    if (usuarioBase) {
      if (!bcrypt.compareSync(password, usuarioBase.password)) {
        res.status(404).json({ message: "Usuario o contraseña incorrectos." });
      } else {
        const token = jwt.sign(
          {
            email: usuarioBase.email,
            user: usuarioBase.user,
            _id: usuarioBase._id,
            id_sede: usuarioBase.id_sede,
            rol: usuarioBase.rol
          },
          process.env.AUTH_KEY
        );
        //token
        res.json({ token });
      }
    } else {
      res.status(404).json({ message: "Este usuario no existe." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports = UserCtrl;
