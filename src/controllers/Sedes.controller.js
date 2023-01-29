const SedeCtrl ={};
const modelSede = require("../models/Sede");


SedeCtrl.createSede = async(req, res) => {
    try {
        //const { data } = req.body;
        console.log('createSede')
        const data = {
            name: 'SEDE PRINCIPAL',
            place: 'AUTLAN DE NAVARRO',
            encargado: 'Esdras López Mundo',
            address: {
                street: '',
                number: '',
                postal_code: ''
            },
            telefono: '',
            edicion: 'PRIMERA',
            email: '',
            main: true
        };

        const sede = await new modelSede(data);
        await sede.save();
      
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
  
        const sedes = await modelSede.findByIdAndUpdate(req.params.idSede, {data});
        res.status(200).json({ message: 'Los datos se modificaron exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}
SedeCtrl.querySedes = async(req, res) => {
    try {
        const sedes = await modelSede.find().sort({main: -1});
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        console.log(error)
    }
}

module.exports = SedeCtrl;