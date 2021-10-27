//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: this file is used to configure Email

const nodemailer = require('nodemailer');
const keys = require('./keys');
const logger = require('../src/utils/logger');

// configuring email
const transport = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: keys.email.MAILGUN_USER,
    pass: keys.email.MAILGUN_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// function for sending email
module.exports = {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, to, subject, html }, (error, info) => {
        if (error) return logger.info(error);
        resolve(info);
      });
    });
  },
};
