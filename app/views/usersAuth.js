var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
const { getDatabaseConnection } = require('../utils/initBDD');

const bddConnection = getDatabaseConnection(); // MYSQL CONNECTOR

const PASSWORD_REGEX = /^(?=.*\d).{4,16}$/;

function cryptPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 5, function(err, bcryptedPassword) {
            resolve(bcryptedPassword);
        });
    });
}

function isPasswordCorrect(password, cryptedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, cryptedPassword, function(errBycrypt, res) {
            resolve(res);
        });
    });
}

module.exports = {
    register: async(req, res) => {
        console.log("POST /api/register");
        // Params
        var { username } = req.body;
        var { password } = req.body;

        //console.log(req.body);
        //console.log(password);

        if (username == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (username.length >= 13 || username.length <= 4) {
            return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
        }

        //return res.status(201).json({ "Success": "parameters OK !" });
        let users = await getUsers(bddConnection);
        userFound = users.find((user) => user.username == username);

        if (userFound) {
            return res.status(400).json({ 'error': 'user already exist' });
        }

        const cryptedPassword = await cryptPassword(password);

        console.log(`MDP (clair) : ${password} => MDP (Chiffré) : ${cryptedPassword}`);

        // const test = await isPasswordCorrect(password, cryptedPassword);
        // console.log(`Res : ${test}`);

        const newUser = {
            username: username,
            password: cryptedPassword,
            admin: 0
        }

        const userAdd = await addUser(bddConnection, newUser);

        return res.status(201).send({});

        // if (userAdd) {
        //     return res.status(201).send({
        //         userId: userAdd.id,
        //         username: userAdd.username,
        //     });
        // }
        // return res.status(500).json({ 'error': 'cannot add user' });
    },

    login: async(req, res) => {
        console.log("POST /api/login");
        // Params
        var { username } = req.body;
        var { password } = req.body;

        console.log(username);

        if (username == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        let users = await getUsers(bddConnection);
        const userFound = users.find((user) => user.username == username);
        console.log(userFound);

        if (!userFound) {
            return res.status(400).json({ 'error': 'user doesn\'t exist' });
        }

        const testPassword = await isPasswordCorrect(password, userFound.password);

        if (!testPassword) {
            return res.status(403).json({ 'error': 'invalid password' });
        }
        return res.status(201).json({
            'username': userFound.username,
            'idUser': userFound.idUser,
            'admin': userFound.admin,
            'token': jwtUtils.generateTokenForUser(userFound) //Important
        });

        //Erreur 500 de reserve ?????????
    },

    getUserProfile: async(req, res) => {
        console.log("TEST /api/test");
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        console.log(`TEST TOKEN : ${headerAuth}`);
        var userId = jwtUtils.getUserId(headerAuth); //THE TOKEN IS CHECK !!!

        if (userId < 0)
            return res.status(400).json({ 'error': 'wrong token' });

        let users = await getUsers(bddConnection);
        const userFound = users.find((user) => user.idUser == userId);

        if (userFound) {
            return res.status(200).send({
                idUser: userFound.idUser,
                username: userFound.username,
                admin: userFound.admin
            });
        }
        return res.status(500).json({ 'error': 'user not found' });
    },

    changePassword: async(req, res) => {
        console.log("Change password /api/changePassword");
        // Params
        var { username } = req.body;
        var { password } = req.body;
        var { newPassword } = req.body;

        console.log(username);

        if (username == null || password == null || newPassword == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
        }

        if (password == newPassword) return res.status(400).json({ 'error': 'the new password is the same than the last one' });

        let users = await getUsers(bddConnection);
        const userFound = users.find((user) => user.username == username);

        if (!userFound) {
            return res.status(400).json({ 'error': 'user doesn\'t exist' });
        }

        const testPassword = await isPasswordCorrect(password, userFound.password);

        if (!testPassword) {
            return res.status(403).json({ 'error': 'invalid password' });
        }

        //changement de mot de passe 
        const cryptedNewPassword = await cryptPassword(newPassword);

        console.log(`MDP (clair) : ${newPassword} => MDP (Chiffré) : ${cryptedNewPassword}`);

        let updatedUser = {
            ...userFound,
            password: cryptedNewPassword
        }

        let userToSend = await updateUser(bddConnection, updatedUser);

        if (userToSend != null) {
            return res.status(201).send({
                idUser: userToSend.idUser,
                username: userToSend.username
            });
        }
    },

    // deleteUser: async function(req, res, id) {
    //     try {
    //         await removeProofById(bddConnection, id);

    //         return res.status(202).send({ message: 'Content successfully deleted !' });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).send({ message: 'Internal error !' });
    //     }
    // },
}