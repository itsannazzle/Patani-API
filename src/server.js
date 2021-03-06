const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const db = require('../db/connection');

const init = async () => {
    const server = Hapi.server({
        port: 3006,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    server.route(routes);
    await server.start();
    console.log(`Server running in ${server.info.uri}`);
};


init();
db.connect();
