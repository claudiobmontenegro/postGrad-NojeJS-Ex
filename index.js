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

app.get('/users/edit', async (req, res) => {
    const { cpf } = req.query;

    try {
        const user = await User.findOne({ cpf });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.render('edit-user', { user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao buscar o usuário.' });
    }
});

app.post('/users/update', async (req, res) => {
    try {
        const { cpf, name, birthDate, email, street, city, state, zipcode } = req.body;

        const user = await User.findOne({ cpf });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name;
        user.birthDate = birthDate;
        user.email = email;
        user.address = {
            street,
            city,
            state,
            zipcode
        };

        await user.save();

        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/users/delete/:cpf', async (req, res) => {
    const { cpf } = req.params;

    try {
        const result = await User.findOneAndDelete({ cpf });

        if (!result) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao excluir o usuário.' });
    }
});

app.use(express.static(__dirname + '/public'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));