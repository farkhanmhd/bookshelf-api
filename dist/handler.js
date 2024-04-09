"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookByIdHandler = exports.editBookByIdHandler = exports.getBookByIdHandler = exports.getAllBooksHandler = exports.addBookHandler = void 0;
const nanoid_1 = require("nanoid");
const books_1 = __importDefault(require("./books"));
const util_1 = __importDefault(require("./util"));
const addBookHandler = async (request, h) => {
    const { name = '', year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;
    const id = (0, nanoid_1.nanoid)(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage,
        reading,
        insertedAt,
        updatedAt,
    };
    if ((0, util_1.default)(name)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    books_1.default.push(newBook);
    const isSuccess = books_1.default.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: { bookId: id },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku.',
    });
    response.code(400);
    return response;
};
exports.addBookHandler = addBookHandler;
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    if (name !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                books: books_1.default
                    .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
                    .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        return response;
    }
    if (reading === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: books_1.default
                    .filter((book) => book.reading === true)
                    .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        return response;
    }
    if (reading === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: books_1.default
                    .filter((book) => book.reading === false)
                    .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        return response;
    }
    if (finished === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: books_1.default
                    .filter((book) => book.finished === true)
                    .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        return response;
    }
    if (finished === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: books_1.default
                    .filter((book) => book.finished === false)
                    .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books_1.default.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    return response;
};
exports.getAllBooksHandler = getAllBooksHandler;
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const desiredBook = books_1.default.filter((book) => book.id === bookId)[0];
    if (desiredBook !== undefined) {
        return { status: 'success', data: { book: { ...desiredBook } } };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};
exports.getBookByIdHandler = getBookByIdHandler;
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name = '', year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books_1.default.findIndex((book) => book.id === bookId);
    if ((0, util_1.default)(name)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    if (index !== -1) {
        books_1.default[index] = {
            ...books_1.default[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
exports.editBookByIdHandler = editBookByIdHandler;
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books_1.default.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books_1.default.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
exports.deleteBookByIdHandler = deleteBookByIdHandler;
