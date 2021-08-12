const client = require('../db/connection');
const cart = require('../src//cart');

const addToCart = async (request, h) => {
    const response = h.response();
    const {
        idUser,
        idProduct,
        qty,
        satuan,
        total,
    } = request.payload;
    console.log(idUser);
    console.log(idProduct);
    console.log(total);

    cartValidation = qty > 0;

    const itemToCart = {
        idUser,
        idProduct,
        qty,
        satuan,
        total,
    };

    console.log(cartValidation);
    if (cartValidation) {
        cart.push(itemToCart);
        await client.query(`insert into keranjang(jumlah, satuan, totalharga, id_user, id_product)
        values($1, $2, $3, $4, $5) RETURNING *`, [`${qty}`, `${satuan}`,
        `${total}`, `${idUser}`, `${idProduct}`]);
        return response.code(200);
    }
    return response.code(400);
};

const getUserCart = async (request, h) => {
    const {idUser} = request.params;
    try {
        const result = await client.query(`select * from keranjang where id_user = $1`, [`${idUser}`]);
        console.log(result.rows);
        return h.response(result.rows).code(200);
    } catch (error) {
        console.log(error);
        h.response().code(404);
    }
};

module.exports = {addToCart, getUserCart};
