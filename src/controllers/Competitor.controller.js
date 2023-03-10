const ParticipanteCtrl = {};
const modelCompetitor = require("../models/Competitor");
const modelSede = require("../models/Sede");
const sendEmail = require("../middleware/sendEmail");
const uploadFileAws = require("../middleware/awsFile");
const { default: mongoose } = require("mongoose");

ParticipanteCtrl.uploadFileMultiple = async (req, res, next) => {
  try {
 
    await uploadFileAws.uploadInscription(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
      }
      return next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
const deleteImagesAws =  async(imagesKeys) =>{
  try {
     imagesKeys.forEach(async imageKey => {
      await uploadFileAws.eliminarImagen(imageKey);
    });
  } catch (error) {
    console.log(error)
  }
}
ParticipanteCtrl.createCompetitor = async (req, res) => {
  try {
    const { body, files } = req;
    const { pay, personal_identify, photo } = files;

    const data = {
      ...body,
      pay_key: pay[0].key,
      pay: pay[0].location,
      personal_identify_key: personal_identify[0].key,
      personal_identify: personal_identify[0].location,
      photo_key: photo[0].key,
      photo: photo[0].location,
      status: "INSCRITO",
    };

    if (
      data.name === "" ||
      data.id_sede === "" ||
      data.address === "" ||
      data.email === "" ||
      data.url_video === "" ||
      data.pay === "" ||
      data.personal_identification === "" ||
      data.phone === "" ||
      data.name_song === "" ||
      data.experience === "" ||
      data.photo === "" ||
      data.place_from === "" ||
      data.birthday === "" ||
      data.genre === "" ||
      data.curp === ""
    ) {
      res
        .status(500)
        .json({ resp: "error", message: "Todos los campos son necesarios." });
      return;
    }
   

    const existCurp = await modelCompetitor.find({ curp: data.curp });
    const existEmail = await modelCompetitor.find({ email: data.email });

   
    const keyImages = [pay[0].key,personal_identify[0].key,photo[0].key];
    let objectUpd ={};
    if (existCurp.length > 0 && existCurp.status !== "RECHAZADO") {
      deleteImagesAws(keyImages);
      res.status(400).json({
        resp: "error",
        message: "Ya se registr?? un participante con esta CURP.",
      });

      return;
    }else{
        objectUpd = {curp: data.curp};
    }
    if (existEmail.length > 0 && existCurp.status !== "RECHAZADO") {
      deleteImagesAws(keyImages);
      res.status(400).json({
        resp: "error",
        message: "Ya se registr?? un participante con este email.",
      });
      return;
    }else{
        objectUpd = {...objectUpd,email: data.email};
    }
    

    if(existEmail.length > 0 && existCurp.status === "RECHAZADO" || existCurp.length > 0 && existCurp.status === "RECHAZADO"){
        await modelCompetitor.findByIdAndUpdate(objectUpd,data);
    }
    
    
    const competitor = await new modelCompetitor(data);

    competitor.save();

    const sede = await modelSede.findById(data.id_sede);

    await sendMailToSedeNewRegisterCompetitor(sede.mail, data.name);
    await sendMailToCompetitorFirstStage(data.email, data.name, data.sede);
    //const participantes = await modelSede.find();
    res.status(200).json({
      resp: "success",
      message:
        "Tu registro se realiz?? correctamente, se te ha enviado un correo confirmando tu registro.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
const sendMailToSedeNewRegisterCompetitor = async (emailSede, name) => {
  try {
 console.log(emailSede, name);
    // <a href="${urlReset}">${urlReset}</a>
    const htmlContentUser = `
        <div>                    
            <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA NUEVO REGISTRO DE COMPETIDOR</h3>
            <h4 style="font-family: sans-serif; margin: 15px 15px;">Hay nuevo registro de competidor en tu sede con el siguiente nombre${name} </h4>

            <a href="www.santanasuena.com">REVISAR </a>

				</div>`;

    await sendEmail.sendEmail(
      emailSede,
      "Santana Suena nueva inscripci??n de competidor",
      htmlContentUser,
      "Santana Suena"
    );
  } catch (error) {
    console.log(error);
  }
};
const sendMailToCompetitorFirstStage = async (email, name, sede) => {
  try {
    console.log(email);
    // <a href="${urlReset}">${urlReset}</a>
    const htmlContentUser = `
                <div>                    
                    <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                    <h4 style="font-family: sans-serif; margin: 15px 15px;">Estimado${name} Hemos recibido tu inscripci??n. Pronto estaremos revisando tus datos y el video que nos proporcionaste. 
                    Pronto te comunicamos si eres seleccionado para la final la sede ${sede}. Felicidades por ser parte de SANTANA SUENA.</h4>
                 
					             
                    <div style=" max-width: 550px;">
                        <p style="padding: 10px 0px;">
                            www.santanasuena.com
                            Responsable:Dr. Mart??n Sandoval G??mez Director y Co-fundador del
                            Centro Comunitario y de Salud Tiopa Tlanextli ???Santuario de Luz
                            A.C.???
                            Tel: 3173826632 Ext. 105 Autl??n de Navarro, Jalisco, C.P. 48903.
                            tiopatlanextli@hotmail.com
                            NOTA IMPORTANTE: <b>TIOPA TLANEXTLI</b> es una Asociaci??n Civil
                            sin fines de lucro, la intenci??n en este concurso es meramente
                            de car??cter cultural y en homenaje al benefactor y co-fundador
                            de esta instituci??n. No contamos con los derechos para manejo de
                            la imagen, ni de la m??sica de <b>CARLOS SANTANA</b>
                            Este programa es sin fines pol??ticos, ni afiliaci??n partidista
                            ni religiosa, es exclusivamente con fines culturales.
                        </p>
                        
                            
          
                    </div>
				</div>`;

    await sendEmail.sendEmail(
      email,
      "Santana Suena Inscripci??n",
      htmlContentUser,
      "Santana Suena"
    );
  } catch (error) {
    console.log(error);
  }
};

ParticipanteCtrl.queryParticipantes = async (req, res) => {
  try {
    
    const { main, id_sede, search } = req.query;

    let $match = {
      $or: [{ name: { $regex: ".*" + search + ".*", $options: "i" } }],
      $and: [],
    };
    const status = req.query.status.split("-");
    if (status.length > 1) {
      $match.$and.push({
        $or: [{ status: status[0] }, { status: status[1] }],
      });
    } else {
      $match.$and.push({
        $or: [
          {
            status: status[0],
          },
        ],
      });
    }

    if (main === "false") {
      $match.$and.push({
        id_sede: mongoose.Types.ObjectId(id_sede),
      });
    }
    const query = await modelCompetitor.aggregate([
      {
        $match,
      },
    ]);

    const competitor = await modelCompetitor.populate(query, {
      path: "id_sede",
    });

    

    res.status(200).json({ competitor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

ParticipanteCtrl.accept = async (req, res) => {
  try {
 
   
    const { id_competitor } = req.query;
    const competitor = await modelCompetitor.findByIdAndUpdate({_id:id_competitor}, {status:'REVISADO'});
    sendMailToCompetitorAccept(competitor.email, {});
    res.status(200).json({ message: 'SE HA ACEPTADO A ESTE PARTICIPANTE. ' });
  } catch (error) {
    console.log(error);
  }
};

ParticipanteCtrl.decline = async (req, res) => {
  try {
    const { id_competitor, reason } = req.body;
    const competitor = await modelCompetitor.findByIdAndDelete({_id:id_competitor}, {status:'RECHAZADO'});
   
    sendMailToCompetitorDecline(competitor.email, reason);
    res.status(200).json({ message: 'SE HA RECHAZADO Y SE LE HA HECHO SABER AL PARTICIPANTE LOS MOTIVOS DEL RECHAZO.' }); 

  } catch (error) {
    console.log(error);
  }
};

const sendMailToCompetitorAccept= async (email, sede) => {
  try {
   
    // <a href="${urlReset}">${urlReset}</a>

      const htmlContentUser = `
                  <div>                    
                      <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                      <h4 style="font-family: sans-serif; margin: 15px 15px;">Su inscripci??n fue aceptada</h4>
                  
                                  
                      <div style=" max-width: 550px; height: 100px;">
                          <p style="padding: 10px 0px;">Ahora eres parte de el proceso de selecci??n de 10 finalistas que est??ran en la gran semifinal.
                        
                          </p>
                          <p style="padding: 10px 0px;">Qu??date pendiente pronto te notificamos si fuiste seleccionado, no te detengas sigue preparando el show.</p>
                      </div>
                      <div style=" max-width: 550px; ">
                      <p style="padding: 10px 0px;">
                          www.santanasuena.com
                          Responsable:Dr. Mart??n Sandoval G??mez Director y Co-fundador del
                          Centro Comunitario y de Salud Tiopa Tlanextli ???Santuario de Luz
                          A.C.???
                          Tel: 3173826632 Ext. 105 Autl??n de Navarro, Jalisco, C.P. 48903.
                          tiopatlanextli@hotmail.com
                          NOTA IMPORTANTE: <b>TIOPA TLANEXTLI</b> es una Asociaci??n Civil
                          sin fines de lucro, la intenci??n en este concurso es meramente
                          de car??cter cultural y en homenaje al benefactor y co-fundador
                          de esta instituci??n. No contamos con los derechos para manejo de
                          la imagen, ni de la m??sica de <b>CARLOS SANTANA</b>
                          Este programa es sin fines pol??ticos, ni afiliaci??n partidista
                          ni religiosa, es exclusivamente con fines culturales.
                      </p>
                      
                          
        
                  </div>
                  </div>`;
  
      await sendEmail.sendEmail(
          email,
          "Santana Suena",
          htmlContentUser,
          "Santana Suena inscripci??n aceptada"
      );
  } catch (error) {
      console.log(error);
  }
};
const sendMailToCompetitorDecline= async (email, reason) => {
    try {
     
      // <a href="${urlReset}">${urlReset}</a>
        const htmlContentUser = `
                    <div>                    
                        <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                        <h4 style="font-family: sans-serif; margin: 15px 15px;">Su inscripci??n fue rechazada</h4>
                    
                                    
                        <div style=" max-width: 550px; height: 100px;">
                            <p style="padding: 10px 0px;">${reason}</p>
                        </div>
                        <div style=" max-width: 550px; height: 100px;">
                        <p style="padding: 10px 0px;">
                            www.santanasuena.com
                            Responsable:Dr. Mart??n Sandoval G??mez Director y Co-fundador del
                            Centro Comunitario y de Salud Tiopa Tlanextli ???Santuario de Luz
                            A.C.???
                            Tel: 3173826632 Ext. 105 Autl??n de Navarro, Jalisco, C.P. 48903.
                            tiopatlanextli@hotmail.com
                            NOTA IMPORTANTE: <b>TIOPA TLANEXTLI</b> es una Asociaci??n Civil
                            sin fines de lucro, la intenci??n en este concurso es meramente
                            de car??cter cultural y en homenaje al benefactor y co-fundador
                            de esta instituci??n. No contamos con los derechos para manejo de
                            la imagen, ni de la m??sica de <b>CARLOS SANTANA</b>
                            Este programa es sin fines pol??ticos, ni afiliaci??n partidista
                            ni religiosa, es exclusivamente con fines culturales.
                        </p>
                        
                            
          
                    </div>
                    </div>`;
    
        await sendEmail.sendEmail(
            email,
            "Santana Suena",
            htmlContentUser,
            "Santana Suena rechazo de inscripci??n"
        );
    } catch (error) {
        console.log(error);
    }
};

ParticipanteCtrl.selectToFinalSedeLocal = async (req, res) => {
    try {
        const { id_competitor, text_to_competitor } = req;

        const competitor = await modelCompetitor.findByIdAndDelete({_id:id_competitor}, {status:'SELECCIONADO'});
      res.status(200).json({ message: 'SE HA SELECCIONADO A ESTE PARTICPANTE COMO FINALISTA ' });
    } catch (error) {
      console.log(error);
    }
  };
  ParticipanteCtrl.sendMailTofinalists= async (email, text_to_competitor) => {
    try {
     
      // <a href="${urlReset}">${urlReset}</a>
        const htmlContentUser = `
                    <div>                    
                        <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                        <h4 style="font-family: sans-serif; margin: 15px 15px;"></h4>
                    
                                    
                        <div style=" max-width: 550px; height: 100px;">
                            <p style="padding: 10px 0px;">${text_to_competitor}</p>
                        </div>
                        <div style=" max-width: 550px; height: 100px;">
                        <p style="padding: 10px 0px;">
                            www.santanasuena.com
                            Responsable:Dr. Mart??n Sandoval G??mez Director y Co-fundador del
                            Centro Comunitario y de Salud Tiopa Tlanextli ???Santuario de Luz
                            A.C.???
                            Tel: 3173826632 Ext. 105 Autl??n de Navarro, Jalisco, C.P. 48903.
                            tiopatlanextli@hotmail.com
                            NOTA IMPORTANTE: <b>TIOPA TLANEXTLI</b> es una Asociaci??n Civil
                            sin fines de lucro, la intenci??n en este concurso es meramente
                            de car??cter cultural y en homenaje al benefactor y co-fundador
                            de esta instituci??n. No contamos con los derechos para manejo de
                            la imagen, ni de la m??sica de <b>CARLOS SANTANA</b>
                            Este programa es sin fines pol??ticos, ni afiliaci??n partidista
                            ni religiosa, es exclusivamente con fines culturales.
                        </p>
                    </div>
                    </div>`;
    
        await sendEmail.sendEmail(
            email,
            "Santana Suena",
            htmlContentUser,
            "Santana Suena rechazo de inscripci??n"
        );
        res.status(200).json({ message: 'El correo se envi?? exitosamente.' });
    } catch (error) {
        console.log(error);
    }
};

  ParticipanteCtrl.deselectToFinalSedeLocal = async (req, res) => {
    try {
        const { id_competitor, text_to_competitor } = req;
     
        const competitor = await modelCompetitor.findByIdAndDelete({_id:id_competitor}, {status:'ACEPTADO'});
      res.status(200).json({ message: 'EL PARTICIPANTE YA NO ES FINALISTA PARA SU SEDE ' });
    } catch (error) {
      console.log(error);
    }
  };  

ParticipanteCtrl.selectToFinalAutlan = async (req, res) => {
  try {
    const { id_competitor, text_to_competitor } = req;
     
    const competitor = await modelCompetitor.findByIdAndDelete({_id:id_competitor}, {status:'ACEPTADO'});
  res.status(200).json({ message: 'EL PARTICIPANTE YA NO ES FINALISTA PARA SU SEDE ' });
  } catch (error) {
    console.log(error);
  }
};
ParticipanteCtrl.deselectToFinalAutlan = async (req, res) => {
    try {
        const { id_competitor, text_to_competitor } = req;
     
        const competitor = await modelCompetitor.findByIdAndDelete({_id:id_competitor}, {status:'ACEPTADO'});
      res.status(200).json({ message: 'EL PARTICIPANTE YA NO ES FINALISTA PARA SU SEDE ' });
    } catch (error) {
      console.log(error);
    }
  };

module.exports = ParticipanteCtrl;
