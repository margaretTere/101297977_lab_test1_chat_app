const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CFG = require('../config/config');


exports.getLoginPage = (req, res) => {
    res.sendFile(`${process.cwd()}/views/login.html`);
};

exports.getSignUpPage = (req, res) => {
    res.sendFile(`${process.cwd()}/views/signup.html`);
};


exports.signUpUser = async  (req, res) =>{
    try {
      const data = req.body;
      const newUser = await User.create(data);

      const token = jwt.sign(
            { id: newUser._id, username: newUser.username }, CFG.SECRET, { expiresIn: '2h' }
      );

      res
      .status(201)
      .json({ message: `User created succesfully.`, token: token });
    
    } catch (err) {
        res
        .status(400)
        .json({ message: err.message });
    }
};


exports.loginUser = async(req,res) =>{
  try { 
    const req_username = req.body.username;
    const req_password = req.body.password;
    
    const user = await User.findOne({ 'username': req_username });

    if(!user)
      throw Error('Invaild Username and password');
    
    const isMatch = await user.matchPassword(req_password);
    if (!isMatch) 
      throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: user._id, username: user.username }, CFG.SECRET, { expiresIn: '2h' }
    );

    res
      .status(200)
      .json({ message: `Login Successful`, token });
  
  } catch (err) {
      res
      .status(400)
      .json({ message: err.message });
  }
};
