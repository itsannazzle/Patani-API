const client = require('../db/connection');
const users = require('./users');

const userRegister = async (request, h) => {
    const response = h.response();
    const {
        email,
        phoneNumber,
        password,
    } = request.payload;

    const newUser = {
        email,
        phoneNumber,
        password,
    };

    const checkEmail = await client.query(`select * from users where email = $1`, [`${email}`]);
    console.log(checkEmail.rows.length);


    if (email && phoneNumber && password && checkEmail.rows.length === 0) {
       users.push(newUser);
       await client.query(`insert into users(email,phone_number,password) 
       values($1, $2, $3) RETURNING *`, [`${email}`, `${phoneNumber}`, `${password}`]);
        return response.code(200);
    }
    return response.code(400);
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
