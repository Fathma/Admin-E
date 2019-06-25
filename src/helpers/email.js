const nodemailer = require('nodemailer');
const keys = require('../../config/keys')

const transport = nodemailer.createTransport({
   service: 'gmail',
   secure: false,
   port: 25,
   auth: {
       user: keys.email.MAILGUN_USER,
       pass: keys.email.MAILGUN_PASS
   },
   tls: {
       rejectUnauthorized: false
   }
});

module.exports = {
    sendEmail(from, to, subject, html){
        return new Promise((resolve, reject)=>{
            transport.sendMail({ from, to, subject, html }, (error, info)=>{
                if(error) return console.log(error);
                resolve(info);
            });
        });
    }
}