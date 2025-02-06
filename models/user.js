const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
},
  firstname: { 
    type: String, 
    required: true 
},
  lastname: { 
    type: String, 
    required: true 
},
  password: { 
    type: String, 
    required: true 
},
  createon: { 
    type: Date, 
    default: Date.now() 
},
});

user.pre('save', async function (next) {
    if (!this.password)
      throw Error('Please provide password');
  
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  });

user.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  

module.exports = mongoose.model('User', user);
