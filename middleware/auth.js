const jwt = require('jsonwebtoken');
const config= require('config');

module.exports = function(req, res, next){
    const token= req.header('x-auth-token');
    try{
        if(!token)return res.status(401).json({ msg: 'No token, authorization denied' });
        jwt.verify(token, config.get('jwtSecret'), (err, decoded)=>{
            if(err)throw err;
            req.user = decoded.user;
            next();
        });

    }
    catch(err){
        console.log(err.message);
        res.status(401).json({ msg: err.message });
    }
}