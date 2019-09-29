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