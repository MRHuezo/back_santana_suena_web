const SedeCtrl ={};
const modelSede = require("../models/Sede");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

SedeCtrl.createSede = async(req, res) => {
    try {
        const { data } = req.body;
        const sede = await new modelSede(data);
        const sedes = await modelSede.find();
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}
SedeCtrl.editSede = async(req, res) => {
    try {
        const { data } = req.body;
  
        const sedes = await modelSede.findByIdAndUpdate(req.params.isSede, {data});
        res.status(200).json({ message: 'Los datos se modificaron exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}
SedeCtrl.querySedes = async(req, res) => {
    try {
        const sedes = await modelSede.find();
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        console.log(error)
    }
}
userCtrl.signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
     
      const sedeBase = await modelSede.findOne({ email: email });
      if (sedeBase) {
        
        if (!bcrypt.compareSync(password, sedeBase.password)) {
            res
              .status(404)
              .json({ message: "Usuario o contraseña incorrectos." });
        } else {
            
            const token = jwt.sign(
              {
                email: sedeBase.email,
                name: sedeBase.name,
                imagen: sedeBase.imagen ? sedeBase.imagen : null,
                _id: sedeBase._id,
                main: sedeBase.main,
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
      res.status(500).json({ message: error });
      console.log(error);
    }
  };
module.exports = SedeCtrl;