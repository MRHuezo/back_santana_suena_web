const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const wwebVersion = '2.2412.54'; 

let whatsapp; // Instancia única de WhatsApp
let qrCode = null; // Almacenar el QR temporalmente
let sessionData = null; // Almacenar los datos de sesión

const initializeWhatsApp = (io) => {
    if (whatsapp) return; // Evitar inicializar múltiples veces

    whatsapp = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ["--no-sandbox"],
        },
        /* webVersionCache: {
            type: 'remote',
            remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
        }, */
    });

    whatsapp.on('qr', (qr) => {
        qrCode = qr;
        /* qrcode.generate(qr, { small: true }, (code) => {
            console.log('QR Code:\n', code);
        }); */
        io.emit('qr', qr); // Emitir el QR al frontend
    });

    whatsapp.on('ready', () => {   
        try {
            qrCode = null;
            io.emit('ready'); // Emitir el evento ready al frontend
            sessionData = {
                // Almacena la información necesaria de la sesión si es necesario.
                clientInfo: whatsapp.info
            };
        } catch (error) {
            console.log(error)
        }
    });

    whatsapp.initialize();
};

const getQrCode = () => qrCode;
const getSessionData = () => sessionData;
const sendMessage = async (phoneNumber, personalizedMessage) => {
    try {
        console.log(personalizedMessage);
        const sanitized_number = phoneNumber.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
       
        const final_number = `52${sanitized_number.substring(sanitized_number.length - 10)}@c.us`;
        
        const number_details = await whatsapp.getNumberId(final_number); // get mobile number details
    console.log(final_number, number_details)
        if (number_details) {
            await whatsapp.sendMessage(number_details._serialized, personalizedMessage); // send message
            return { success: true, message: 'Message sent successfully' };
        } else {
            return { success: false, message: 'Mobile number is not registered' };
        }
    } catch (error) {
        console.error(`Error sending message to ${phoneNumber}:`, error);
        return { success: false, message: 'Mobile number is not registered' };
    }
};
module.exports = {
    initializeWhatsApp,
    getQrCode,
    getSessionData,
    sendMessage
};

