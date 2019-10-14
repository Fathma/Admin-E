//  Author: Fathma Siddique
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: these keys will work in the production env

module.exports = {
    database:{
        mongoURI: process.env.mongoURI 
    },
    email:{
        MAILGUN_USER: process.env.MAILGUN_USER,
        MAILGUN_PASS: process.env.MAILGUN_PASS 
    },
    session:{
        secret: process.env.session_secret
    },
    jwt:{
        secret: process.env.jwt_secret
    }
}