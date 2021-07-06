const {addNewUser, userLogin, addNewProduct, getAllProduct, getAllUser, getUserById} = require('./handler');

const routes = [
    //  endpoint user
    {
        method: 'POST',
        path: '/user',
        handler: addNewUser,
    },
    {
        method: 'GET',
        path: '/user/{email}',
        handler: getUserById,
    },
    {
        method: 'GET',
        path: '/user',
        handler: getAllUser,
    },
    // user login
    {
        method: 'POST',
        path: '/user/login',
        handler: userLogin,
    },
    //  endpoint produk
    {
        method: 'POST',
        path: '/product',
        handler: addNewProduct,
    },
    {
        method: 'GET',
        path: '/product',
        handler: getAllProduct,
    },
];

module.exports = routes;
