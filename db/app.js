const client = require('./connection');
const {nanoid} = require('nanoid');
const users = require('../src/users');

const addNewUserToDb = async (request, h) => {
    const {
        email,
        phoneNumber,
        password,
    } = request.payload;
    const idUser = nanoid(8);
    const checkEmail = users.find((user) => user.email === email);
    if (email && phoneNumber && password && !checkEmail) {
        const newUser = {
            idUser,
            email,
            phoneNumber,
            password,
        };
        users.push(newUser);
    }
    const userAdded = await client.query(`insert into users(id,email,phone_number,password) 
    values($1, $2, $3, $4) RETURNING *`, [`${idUser}`, `${email}`, `${phoneNumber}`, `${password}`]);
    const isSuccess = users.filter((user) => user.idUser === idUser).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            users: {
                email,
                password,
            },
        });
        response.code(201);
        console.log(userAdded.rows);
        userAdded.rows;
        return response;
    } else if (!email || !password || !phoneNumber) {
        const response = h.response({
            status: 'failed',
            message: 'fill every form',
        });
        response.code(400);
        return response;
    } else if (checkEmail) {
        const response = h.response({
            status: 'failed',
            message: 'email already exist',
        });
        response.code(400);
        return response;
    }
    const response = h.response({
            status: 'failed',
            message: 'create user failed',
        });
        response.code(400);
        return response;
};

module.exports = {addNewUserToDb};
