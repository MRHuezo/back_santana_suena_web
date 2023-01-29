const UserCtrl = {};
const modelUser = require("../models/User");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

UserCtrl.createUser = async (req, res) => {
  try {
    const { data } = req.body;
//rol FIRST= el que va a poder selccionar finalistas, 
//JUDGE = solo puede entrar a ver a los participantes,
   /*  const data = {
      email: "museodelrockmx@gmail.com",
      user:"MEX_SEDEUSERGUAN",
      password: "1Cb45CxrA35AB2",
      id_sede: "63d0c684f9bec5453e78a104",
      rol: 'FIRST'
     
    }; */
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
    const { email, password } = req.body;

    const userBase = await modelUser.findOne({ email: email });
    if (userBase) {
      if (!bcrypt.compareSync(password, userBase.password)) {
        res.status(404).json({ message: "Usuario o contraseña incorrectos." });
        return;
      } else {
        const token = jwt.sign(
          {
            email: userBase.email,
            _id: userBase._id,
            id_sede: userBase.id_sede,
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
