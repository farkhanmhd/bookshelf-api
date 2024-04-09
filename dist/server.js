"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const routes_1 = __importDefault(require("./routes"));
const init = async () => {
    const server = hapi_1.default.server({
        port: 9000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: { origin: ['*'] },
        },
    });
    server.route(routes_1.default);
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};
init();
