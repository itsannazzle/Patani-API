const client = require('../db/connection');
const products = require('../src/products');

const addNewProduct = async (request, h) => {
    const response = h.response();
    const {
        idUser,
        title,
        price,
        amount,
        desc,
    } = request.payload;
    console.log(`title : ${title.length}`);
        console.log(`price : ${price.length}`);

    const productValidation = title.length > 3 && price.length >= 3;

    const newProduct = {
        idUser,
        title,
        price,
        amount,
        desc,
    };
    console.log(productValidation);
    if (productValidation) {
        products.push(newProduct);
        await client.query(`insert into products(id_user, title, price, amount, description) 
       values($1, $2, $3, $4, $5) RETURNING *`, [`${idUser}`, `${title}`,
       `${price}`, `${amount}`, `${desc}`]);
       return response.code(200);
    }
    return response.code(400);
};

const getAllProduct = async (request, h) => {
    const {idUser} = request.params;
    try {
        const result = await client.query(`select * from products where id_user = $1`, [`${idUser}`]);
        console.log(result.rows);
        return h.response({
            products: result.rows,
        }).code(200);
    } catch (error) {
        console.log(error);
        h.response().code(404);
    }
};


// const getProductById = (request, h) => {
//     const {idProduct} = request.params;

//     const findProduct = products.find((prod) => prod.idProduct === idProduct);

//     if (findProduct) {
//         const response = h.response({
//             status: 'success',
//             product: findProduct,
//         });
//         response.code(200);
//         return response;
//     }
//     const response = h.response({
//         status: 'failed',
//         message: 'product not found',
//     });
//     response.code(404);
//     return response;
// };

module.exports = {addNewProduct, getAllProduct};
