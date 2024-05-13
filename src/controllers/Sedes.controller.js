const SedeCtrl ={};
const modelSede = require("../models/Sede");
const modelCompetitor = require("../models/Competitor");

SedeCtrl.createSede = async(req, res) => {
    try {
        //const { data } = req.body;
      
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

        const { edicion} = req.params;
        
        let edicion_letter = "";
        switch (edicion) {
            case '2023':
                edicion_letter = "PRIMERA";
                break;
            case '2024':
                edicion_letter = "SEGUNDA";
                break;
            default:
                break;
        }
    
        const sedes = await modelSede.find({edicion: edicion_letter}).sort({main: -1});
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}

SedeCtrl.queryGetSedeCompetitors = async(req, res) => {
    try {
        const {id_name, edicion} = req.params;
        
        let edicion_letter = "";
        switch (edicion) {
            case '2023':
                edicion_letter = "PRIMERA";
                break;
            case '2024':
                edicion_letter = "SEGUNDA";
                break;
            default:
                break;
        }
       
        const sede = await modelSede.findOne({id_name: id_name, edicion: edicion_letter});
      
        const competitors = await modelCompetitor.find({id_sede: sede._id});
        res.status(200).json({sede, competitors});
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}

module.exports = SedeCtrl;