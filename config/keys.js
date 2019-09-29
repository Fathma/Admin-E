//  Author: Fathma Siddique
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: this file has all the secret keys 


if(process.env.NODE_ENV == 'production'){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}
