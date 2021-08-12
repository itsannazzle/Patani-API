const {addToCart, getUserCart} = require('./cartHhandler');
const {addNewProduct, getAllProduct} = require('./productHandler');
const {userRegister, getUserByUsername, getAllUser, userLogin} = require('./usersHandler');

const routes = [
    //  endpoint user
    {
        method: 'POST',
        path: '/user/register',
        handler: userRegister,
    },
    {
        method: 'GET',
        path: '/user/{email}',
        handler: getUserByUsername,
    },
    {
        method: 'GET',
        path: '/user',
        handler: getAllUser,
    },
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
        path: '/product/{idUser}',
        handler: getAllProduct,
    },
    // endpoint keranjang
    {
        method: 'POST',
        path: '/cart',
        handler: addToCart,
    },
    {
        method: 'GET',
        path: '/cart/{idUser}',
        handler: getUserCart,
    },
];

module.exports = routes;
