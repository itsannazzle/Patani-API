const client = require('../db/connection');
const users = require('./users');
const {nanoid} = require('nanoid');

const userRegister = async (request, h) => {
    const {
        email,
        phoneNumber,
        password,
    } = request.payload;
    const idUser = nanoid(8);
    const checkEmail = users.find((user) => user.email === email);
    const newUser = {
        idUser,
        email,
        phoneNumber,
        password,
    };

    if (email && phoneNumber && password && !checkEmail) {
       users.push(newUser);
       userAdded = await client.query(`insert into users(id,email,phone_number,password) 
       values($1, $2, $3, $4) RETURNING *`, [`${idUser}`, `${email}`, `${phoneNumber}`, `${password}`]);
    }

    const isSuccess = users.filter((user) => user.idUser === idUser).length > 0;

    if (isSuccess) {
        const response = h.response();
        return response.code(200);
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

const getAllUser = async (request, h) => {
    try {
        const result = await client.query(`select * from users`);
        const userResult = result.rows;
        const response = h.response({
            users: userResult,
    });
    response.code(200);
    return response;
    } catch (error) {
            const response = h.response({
            status: 'failed',
            message: 'failed get users',
            });
        response.code(500);
        console.log(error);
    return response;
    }
};

const getUserByUsername = async (request, h) => {
    const {email} = request.params;

    const result = await client.query(`select * from users where email = $1`, [`${email}`]);
    // const findUser = users.find((user) => user.email === email);
    console.log(result.rows);
    if (result.rows.length === 1) {
        const response = h.response({
            user: result.rows,
        });
        response.code(200);
        return response;
    }
    const response = h.response();
    response.code(404);
    return response;
};

const userLogin = async (request, h) => {
    const {
        email,
        password,
    } = request.payload;
        const result = await client.query(`select * from users where email =$1 and password=$2`,
        [`${email}`, `${password}`]);

    if (result.rows.length == 1) {
        const response = h.response({
            user: result.rows,
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'failed',
        message: 'user not found',
    });
    response.code(404);
    return response;
};

module.exports = {userRegister, userLogin, getAllUser, getUserByUsername};
