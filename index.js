require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Address = require('./models/Address');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');

app.listen(process.env.PORT, () => {
    console.log(`Serviço funcionando na porta: ${process.env.PORT}`)
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connect = () => {
    mongoose.connect(process.env.DATABASE)
        .then(() => {
            console.log('Mongodb conectado com sucesso!')
            return true
        }).catch((e) => {
            console.log(e)
        })
}

const disconnect = () => {
    mongoose.disconnect().then(() => {
        console.log('MondoDB desconectado com sucesso')
        return true
    }).catch((e) => {
        console.log(e)
        return false
    })
}

connect();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/cadastro', async (req, res) => {
    const { name, cpf, birthDate, email, password, street, city, state, zipCode } = req.body;

    try {
        const user = new User({
            name,
            cpf,
            birthDate,
            email,
            password,
            address: {
                street,
                city,
                state,
                zipCode
            }
        });

        await user.save();        

        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao cadastrar o usuário.');
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao carregar os usuários.');
    }
});

app.use(express.static(__dirname + '/public'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));