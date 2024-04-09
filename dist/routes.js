"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./handler");
const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: handler_1.addBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: handler_1.getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: handler_1.getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: handler_1.editBookByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: handler_1.deleteBookByIdHandler,
    },
];
exports.default = routes;
