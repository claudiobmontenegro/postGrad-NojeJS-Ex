const mongoose = require('mongoose');
const Address = require('./Address');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: Address.schema
});

const User = mongoose.model('User', userSchema);

module.exports = User;