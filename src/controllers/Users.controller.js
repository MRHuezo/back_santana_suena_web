const UserCtrl = {};
const modelUser = require("../models/User");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

UserCtrl.createUser = async (req, res) => {
  try {
    //const { data } = req.body;
//rol FIRST= el que va a poder selccionar finalistas, 
//JUDGE = solo puede entrar a ver a los participantes,
   const data = {
      email: "tijuanaJuez@gmail.com",
      user:"TIJ_SEDEUSERTWO",
      password: "3WybDoSNjfjm8bW",
      id_sede: "63d0c650dd0e867ac6996ffe",
      rol: 'SECOND'
     
    }; 
    const user = await new modelUser(data);
    bcrypt.hash(data.password, null, null, function (err, hash) {
      if (err) {
        res
          .status(500)
          .json({ message: "Can´t encrypt password :(", err });
      } else {
        user.password = hash;
        user.save(async (err, userStored) => {
          if (err) {
            res.status(500).json({
              message: "Ups. Something went wrong.",
              resp: err,
            });
            return;
          } 
        });
      }
    });

    const users = await modelUser.find();
    res.status(200).json({ resp: 'success', usuarios: users });
  } catch (error) {
    res.status(500).json({resp:'error', message: error });
    console.log(error);
  }
};

UserCtrl.signIn = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const usuarioBase = await modelUser.findOne({ user: usuario }).populate("id_sede");

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
