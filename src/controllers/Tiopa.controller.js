const fileAws = require("../middleware/awsFile");
const sendEmail = require("../middleware/sendEmail");
const { getQrCode, getSessionData, sendMessage, sendMessageWithImage,sendMessageWithMultipleImages } = require("../middleware/whatsapp");
const multer = require('multer');
const xlsx = require('xlsx');
const axios = require('axios');
const fs = require('fs');
const path = require('path'); // Importamos path
const { MessageMedia } = require('whatsapp-web.js'); // Asegúrate de importar MessageMedia


const url = 'https://graph.facebook.com/v20.0/112831671869077/messages';
const accessToken = 'EAASUSnz4zIsBO4hhKpV2Tk1QLc5ukQqAAjxxIwXCbjzjpvApSK2sVihVrL6fdO129BkNqAHCxZBWlHR0wVjxxNogC7pRlI5ZB2K7zodtfya8p4GSdxzfOTYyiJUPk2ZBY6NIYGzoQicFZAt4g5Kpbwzwj2rGibQqsyoIw1enKCGcz2H2aijDHpOYK9J1ulc5eAMjlV38MqTzVprV2LxmmlGf2ZCZAEWCpS1rsZD';

const upload = multer({ dest: 'uploads/' });

const TiopaCtrl = {};

TiopaCtrl.getFiles = async (req, res) => {
    try {
        
        const files = await fileAws.obtenerArchivosEnCarpeta('FilesToGaleria');
        res.status(200).json({ files: files });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

TiopaCtrl.sendEmail = async (req, res) => {
    try {
        console.log(req.body);
        const htmlContentUser = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tiopa Web</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                .contact-info {
                    margin-bottom: 20px;
                }
                .contact-info label {
                    font-weight: bold;
                }
                .contact-info p {
                    margin: 5px 0;
                }
                .contact-message {
                    margin-bottom: 20px;
                }
                .contact-message label {
                    font-weight: bold;
                }
                .contact-message p {
                    margin: 5px 0;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h1>Tiopa Web</h1>
                <div class="contact-info">
                    <p>${req.body.contactFirstName}</p>
                    <p>${req.body.contactLastName}</p>
                    <p>${req.body.contactEmail}</p>
                    <p>${req.body.contactSubject}</p>
                </div>
                <div class="contact-message">
                    <label>Mensaje:</label>
                    <p>${req.body.contactMessage}</p>
                </div>
            </div>
            </body>
            </html>
        `;

        await sendEmail.sendEmail(
            process.env.RECEPTOR_EMAIL,
            "Mensaje de página web",
            htmlContentUser,
            "Tiopa Tlanextli Web"
        ); 
        res.status(200).json({ message: "Correo enviado con éxito." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

TiopaCtrl.uploadXls = [
    upload.fields([{ name: 'excelFile' }, { name: 'imageFiles' }]), // Cambiar para recibir múltiples archivos de imagen
    async (req, res) => {
        const { nameColumns, message } = req.body;

        // Verificar que se haya proporcionado un mensaje
        if (!message) {
            return res.status(400).send('No message provided');
        }

        try {
            const filePath = req.files['excelFile'][0].path; // Usar el archivo de Excel
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json(sheet);
           
            let results = [];
           
            const splitNamesColumns = JSON.parse(nameColumns);
            const imageFiles = req.files['imageFiles']; // Obtener todos los archivos de imagen

            // Crear un mapa de imágenes por nombre de archivo
        /*     const imageMap = {};
            if (imageFiles) {
                imageFiles.forEach(image => {
                    const fileName = path.basename(image.originalname, path.extname(image.originalname));
                    const imageData = fs.readFileSync(image.path);
                    const base64Image = imageData.toString('base64');
                    imageMap[fileName] = new MessageMedia('image/png', base64Image); // Cambia 'image/png' según el tipo de imagen
                });
            }
 */ 
            const mediaArray = [];
            imageFiles.forEach(image => {
                const fileName = path.basename(image.originalname, path.extname(image.originalname));
                const imageData = fs.readFileSync(image.path);
                const base64Image = imageData.toString('base64');
                const media= new MessageMedia('image/png', base64Image); // Cambia 'image/png' según el tipo de imagen
                mediaArray.push(media);
            });
            

            /* for (const row of rows) {
                const phoneNumber = row[splitNamesColumns[0].toString()];
                const name = row[splitNamesColumns[1].toString()];
                
                const personalizedMessage = message.replace('{name}', name);
   
                // Verificar si hay una imagen correspondiente
                const media = imageMap[name];
      
                // Enviar el mensaje con la imagen si existe, o solo el mensaje si no
                const statusMessage = media 
                    ? await sendMessageWithImage(phoneNumber, personalizedMessage, media)
                    : await sendMessage(phoneNumber, personalizedMessage);

                results.push({
                    Name: name,
                    PhoneNumber: phoneNumber,
                    statusMessage: statusMessage.message,
                    Sent: statusMessage.success ? 'Yes' : 'No'
                });
            } */

                for (const row of rows) {
                    const phoneNumber = row[splitNamesColumns[0].toString()];
                    const name = row[splitNamesColumns[1].toString()];
                    
                    const personalizedMessage = message.replace('{name}', name);
           
                    // Enviar el mensaje con las imágenes si existen, o solo el mensaje si no
                    let statusMessage;
                   
                        statusMessage = mediaArray.length > 0 
                            ? await sendMessageWithMultipleImages(phoneNumber, personalizedMessage, mediaArray[0])
                            : await sendMessage(phoneNumber, personalizedMessage);
                        console.log(statusMessage);
                        results.push({
                            Name: name,
                            PhoneNumber: phoneNumber,
                            statusMessage: statusMessage.message,
                            Sent: statusMessage.success ? 'Yes' : 'No'
                        });
                    
                }
    
                const newWorkbook = xlsx.utils.book_new();
                const newWorksheet = xlsx.utils.json_to_sheet(results);
                xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Results');
                
                // Guardar el archivo Excel de resultados
                const outputFilePath = path.join(__dirname, 'error_results.xlsx');
                xlsx.writeFile(newWorkbook, outputFilePath);
                
                // Enviar el archivo como respuesta
                res.download(outputFilePath, 'error_results.xlsx', (err) => {
                    if (err) {
                        console.error('Error downloading file:', err);
                        res.status(500).send('Error downloading file');
                    } else {
                        // Eliminar el archivo después de que se haya enviado
                        fs.unlink(outputFilePath, (err) => {
                            if (err) console.error('Error deleting file:', err);
                        });
                    }
                });

        } catch (error) {
            console.error('Error processing file:', error);
            res.status(500).send('Error processing file');
        }
    }
];


TiopaCtrl.initializeWhatsApp = (req, res) => {
    res.status(200).json({ message: 'WhatsApp client initialized' });
};

TiopaCtrl.getQrCode = (req, res) => {
    const qr = getQrCode();
    if (qr) {
        res.status(200).json({ qr });
    } else {
        res.status(404).json({ message: 'QR code not found' });
    }
};

TiopaCtrl.getSessionData = (req, res) => {
    const session = getSessionData();
    if (session) {
        res.status(200).json(session);
    } else {
        res.status(404).json({ message: 'Session data not found' });
    }
};

module.exports = TiopaCtrl;
