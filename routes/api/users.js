const express = require('express');
const {check, validationResult}= require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const normalize = require('normalize-url');
const jwt= require('jsonwebtoken');
const config = require('config');
const User= require('../../models/User');


const router= express.Router();

 router.post('/',[
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Please enter a 6 or more characters long password').isLength({min:6}),
], async (req, res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({errors:errors.array()});
    const { name, email, password } = req.body;

    try {
         // see if user already exists
        let user = await User.findOne({ email });
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }
        // fetch avatar 
        const avatar = normalize(
          gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          }),
          { forceHttps: true }
        );
        
        // Creating user object
        user = new User({
          name,
          email,
          avatar,
          password
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // return jwt 
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: '5 days' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
});
module.exports = router;