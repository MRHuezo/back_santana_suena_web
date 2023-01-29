const ParticipanteCtrl ={};
const modelCompetitor = require("../models/Competitor");
const sendEmail = require("../middleware/sendEmail");

ParticipanteCtrl.createCompetitor = async(req, res) => {
    try {
        //const { data } = req.body;
        const data ={ 
            name: 'Fractal Estudio Mx',
            id_sede:'63d0c6050bb0de7af0a603f6',
            address: {
                street: 'Hechos',
                number: '22',
                postal_code: '48900'
            },
            email:'fractalestudiomx@gmail.com',
            url_video:'https://www.youtube.com/watch?v=icsr89F04Mw',
            pay_image: '74983993',
            personal_identification: '9364633',
            phone: '3151526613',
            name_song: 'Flor de luna',
            experience: 'Naci en una ciudad que reconocía su llegada para aportar al mundo...',
            place_from: 'Autlán de Navarro',
            birthday: '15/01/1990',
            genre: 'Masculino'
        };  
        
        if(data.name === '' || data.id_sede === '' ||  data.address.street === ''||  data.address.number === ''
        ||  data.address.postal_code ==='' ||  data.email === '' ||  data.url_video === '' ||  data.pay_image === '' 
        ||  data.personal_identification === '' ||  data.phone  === '' ||  data.name_song === '' ||  data.experience === ''
        ||  data.place_from  === '' ||  data.birthday === '' || data.genre === '')  
        {  
            res.status(500).json({resp: 'error',message:'Todos los campos son necesarios.' });
            return;
        }
        
        sendMailToCompetitorFirstStage(data.email);
        const competitor = await new modelCompetitor(data);
        competitor.save();
        //const participantes = await modelSede.find();
        res.status(200).json({ resp: 'success', message: 'Tu registro se realizó correctamente, se te ha enviado un correo confirmando tu registro.' });
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}
const sendMailToCompetitorFirstStage = async (email)  =>{
    try {
        console.log(email);
        // <a href="${urlReset}">${urlReset}</a>
        const htmlContentUser = `
                <div>                    
                    <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                    <h4 style="font-family: sans-serif; margin: 15px 15px;">Hemos recibido tu inscripción pronto estaremos revisandolo. Pronto te comunicamos si eres seleccionado para la gran final. Mucha suerte.:</h4>
                    
					             
                    <div style=" max-width: 550px; height: 100px;">
                        <p style="padding: 10px 0px;">SANTANA SUENA.</p>
                    </div>
				</div>`;

    await sendEmail.sendEmail(
      email,
      "Santana Suena Inscripción",
      htmlContentUser,
      "Santana Suena"
    );
    } catch (error) {
        console.log(error)
    }
}
ParticipanteCtrl.queryParticipantes = async(req, res) => {
    try {
        const sedes = await modelSede.find();
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        console.log(error)
    }
}
ParticipanteCtrl.seleccionarParticipante = async(req, res) => {
    try {
        const sedes = await modelSede.find();
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        console.log(error)
    }
}
module.exports = ParticipanteCtrl;
