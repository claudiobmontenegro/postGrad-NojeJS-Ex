const mongoose = require('mongoose');
const Address = require('./Address');

const userSchema = new mongoose.Schema({
    name: String,
    cpf: String,
    birthDate: Date,
    email: String,
    password: String,
    address: Address.schema
});

const User = mongoose.model('User', userSchema);

module.exports = User;