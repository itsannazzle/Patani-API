const {nanoid} = require('nanoid');
const products = require('./products');
const users = require('./users');
const client = require('../db/connection');
    //  users handler
const addNewUser = (request, h) => {
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

const getAllUser = () => ({
    status: 'success',
    data: {
        users,
    },
});

const getAllUserFromDb = async (request, h) => {
    try {
        const result = await client.query(`select * from users`);
    const userResult = result.rows;
    const response = h.response({
        status: 'success',
        users: {
             userResult,
        },
    });
    response.code(200);
    userResult.rows;
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

const getUserById = async (request, h) => {
    const {email} = request.params;

    const result = await client.query(`select * from users where email = $1`, [email]);
    const findUser = users.find((user) => user.email === email);

    if (findUser) {
        const response = h.response({
            status: 'success',
            users: {
                user: result.rows,
            },
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

const userLogin = (request, h) => {
    const {
        email,
        password,
    } = request.payload;
    console.log(`ini email : ${request.payload}`);
    const userLogin = users.find((user) => user.email === email && user.password === password);

    if (userLogin) {
        const response = h.response({
            status: 'success',
            user: userLogin,
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

    //  products handler
const addNewProduct = (request, h) => {
    const {
        namaProduct,
        hargaProduct,
        jumlahProduct,
        descProduct,
    } = request.payload;
    const idProduct = nanoid(8);
    const statusProduct = jumlahProduct > 0;
    const newProduct = {
        idProduct,
        namaProduct,
        hargaProduct,
        jumlahProduct,
        descProduct,
        statusProduct,
    };
    products.push(newProduct);

    const isSuccess = products.filter((prod) => prod.idProduct === idProduct).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            products: newProduct,
        });
        response.code(201);
        return response;
    }
     const response = h.response({
        status: 'failed',
        message: 'add product failed',
    });
        response.code(400);
        return response;
};

const getAllProduct = () => ({
    status: 'success',
    data: {
        products,
    },
});

const getProductById = (request, h) => {
    const {idProduct} = request.params;

    const findProduct = products.find((prod) => prod.idProduct === idProduct);

    if (findProduct) {
        const response = h.response({
            status: 'success',
            product: findProduct,
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'failed',
        message: 'product not found',
    });
    response.code(404);
    return response;
};

module.exports = {addNewUser, userLogin, addNewProduct,
                getAllProduct, getAllUser, getUserById,
                getProductById, getAllUserFromDb};
