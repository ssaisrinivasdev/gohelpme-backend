const nodemailer = require('nodemailer');

const sendEmail = async (toMail) => {

    var verifiation_code = Math.random() * (999999 - 100000) + 100000

  //TODO: Send code to mail
  const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.SENDER_MAIL_ID,
          pass: process.env.SENDER_MAIL_PASSWORD
      }
  }) 
  
  const mailDetails = {
      from: process.env.SENDER_MAIL_ID,
      to: toMail,
      subject: 'Verification code',
      html: '<p>Please verify your account by using the below verification code.</p><b/><b/><h3>Your verification code</h3><b/><h1>'+
        parseInt(verifiation_code)+'</h1>'
  }

  mailTransporter.sendMail(mailDetails).then(()=>{
    console.log('Email sent')
  }).catch((error)=>{
    console.error(error)
  });

  return parseInt(verifiation_code)
};

module.exports = sendEmail;