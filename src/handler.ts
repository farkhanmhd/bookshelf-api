import hapi from '@hapi/hapi';
import { nanoid } from 'nanoid';
import books, { IBook } from './books';
import isNullOrWhitespace from './util';

const addBookHandler = async (
  request: hapi.Request,
  h: hapi.ResponseToolkit
) => {
  const {
    name = '',
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload as {
    name: string;
    year: number;
    author: string;
    summary: string;
    publisher: string;
    pageCount: number;
    readPage: number;
    reading: boolean;
  };

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook: IBook = {
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

  if (isNullOrWhitespace(name)) {
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
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess: boolean = books.filter((book) => book.id === id).length > 0;

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

const getAllBooksHandler = (request: hapi.Request, h: hapi.ResponseToolkit) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
          )
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
        books: books
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
        books: books
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
        books: books
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
        books: books
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
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  return response;
};

const getBookByIdHandler = (request: hapi.Request, h: hapi.ResponseToolkit) => {
  const { bookId } = request.params;

  const desiredBook = books.filter((book) => book.id === bookId)[0];

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

const editBookByIdHandler = (
  request: hapi.Request,
  h: hapi.ResponseToolkit
) => {
  const { bookId } = request.params;
  const {
    name = '',
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload as {
    name: string;
    year: number;
    author: string;
    summary: string;
    publisher: string;
    pageCount: number;
    readPage: number;
    reading: boolean;
  };

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (isNullOrWhitespace(name)) {
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
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
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

const deleteBookByIdHandler = (
  request: hapi.Request,
  h: hapi.ResponseToolkit
) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
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

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
