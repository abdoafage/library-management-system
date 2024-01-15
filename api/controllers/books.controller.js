import { Book } from "../models/books.model.js";
import { sequelize } from "../config.js";

const listAllBooks = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.method = 'get'
  // #swagger.summary = 'List all books'
  // #swagger.description = 'Retrieve a list of all books.'
  // #swagger.responses[200] = { description: 'A list of books.', schema: [{ id: 1, title: "Book Title", description: "Book Description", author: "Author Name", isbn: "1234567890", available_quantity: 10, shelf_location: "A1" }] }
  // #swagger.responses[500] = { description: 'Internal server error.' }

  try {
    const SQL_query = `SELECT id, title, description, author, isbn, available_quantity, shelf_location 
    FROM "Book"`;
    const [data, metadata] = await sequelize.query(SQL_query);
    // const data = await Book.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.method = 'get'
  // #swagger.summary = 'Get a particular book by ID'
  // #swagger.description = 'Retrieve a book by its ID.'
  // #swagger.parameters['id'] = { in: 'path', description: 'Book ID.', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'The book with the specified ID.', schema: { id: 1, title: "Book Title", description: "Book Description", author: "Author Name", isbn: "1234567890", available_quantity: 10, shelf_location: "A1" } }
  // #swagger.responses[404] = { description: 'Book not found.' }
  // #swagger.responses[500] = { description: 'Internal server error.' }

  const { id } = req.params;
  try {
    const SQL_query = `SELECT id, title, description, author, isbn, available_quantity, shelf_location
      FROM "Book"
      WHERE id = ?
      `;

    const [data, metadata] = await sequelize.query(SQL_query, {
      replacements: [id],
    });

    if (data.length == 0) {
      return res.status(404).json({ message: "this book does not exist." });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.method = 'post'
  // #swagger.summary = 'Create a new book'
  // #swagger.description = 'Create a new book.'
  // #swagger.parameters['book'] = { in: 'body', description: 'Book details.', required: true, type: 'object', schema: { title: "New Book", description: "Book Description", author: "Author Name", isbn: "0987654321", available_quantity: 5, shelf_location: "B2" } }
  // #swagger.responses[201] = { description: 'The newly created book.', schema: { id: 2, title: "New Book", description: "Book Description", author: "Author Name", isbn: "0987654321", available_quantity: 5, shelf_location: "B2" } }
  // #swagger.responses[400] = { description: 'Bad request. Invalid input data.' }
  // #swagger.responses[500] = { description: 'Internal server error.' }

  const {
    title,
    author,
    description,
    isbn,
    available_quantity,
    shelf_location,
  } = req.body;
  try {
    const book = await Book.create({
      title,
      author,
      isbn,
      description,
      available_quantity,
      shelf_location,
    });
    res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const updateBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.method = 'put'
  // #swagger.summary = 'Update a book by ID'
  // #swagger.description = 'Update a book with the specified ID.'
  // #swagger.parameters['id'] = { in: 'path', description: 'Book ID.', required: true, type: 'integer' }
  // #swagger.parameters['book'] = { in: 'body', description: 'Updated book details.', required: true, type: 'object', schema: { title: "Updated Book", description: "Updated Description", author: "New Author", isbn: "1112223333", available_quantity: 15, shelf_location: "C3" } }
  // #swagger.responses[200] = { description: 'Book updated successfully.' }
  // #swagger.responses[400] = { description: 'Bad request. Invalid input data.' }
  // #swagger.responses[500] = { description: 'Internal server error.' }

  const { id } = req.params;
  const {
    title,
    author,
    description,
    isbn,
    available_quantity,
    shelf_location,
  } = req.body;

  const updated_book = await Book.update(req.body, { where: { id } });

  if (updated_book[0]) {
    return res.status(200).json({ message: "updated successfully" });
  } else {
    return res.status(400).json({ message: "updated failed" });
  }
};

const deleteBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.method = 'delete'
  // #swagger.summary = 'Delete a book by ID'
  // #swagger.description = 'Delete a book with the specified ID.'
  // #swagger.parameters['id'] = { in: 'path', description: 'Book ID.', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'The deleted book.', schema: { id: 2, title: "Deleted Book", description: "Book Description", author: "Author Name", isbn: "0987654321", available_quantity: 5, shelf_location: "B2" } }
  // #swagger.responses[404] = { description: 'Book not found.' }
  // #swagger.responses[500] = { description: 'Internal server error.' }

  const { id } = req.params;

  const SQL_query = `DELETE FROM "Book"
WHERE id = ?
RETURNING id, title, author, description, isbn, available_quantity, shelf_location`;

  const [data] = await sequelize.query(SQL_query, {
    replacements: [id],
  });

  if (data.length) {
    return res.status(200).json(data[0]);
  } else {
    return res
      .status(404)
      .json({ message: "this book does not exist to delete" });
  }
};

const searchOnBookBy = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.method = 'get'
  // #swagger.summary = 'Search for books based on criteria'
  // #swagger.description = 'Search for books based on title, author, and/or ISBN.'
  // #swagger.parameters['title'] = { in: 'query', description: 'Title of the book.', type: 'string' }
  // #swagger.parameters['author'] = { in: 'query', description: 'Author of the book.', type: 'string' }
  // #swagger.parameters['isbn'] = { in: 'query', description: 'ISBN of the book.', type: 'string' }
  // #swagger.responses[200] = { description: 'A list of books that match the search criteria.', schema: [{ id: 1, title: "Book Title", description: "Book Description", author: "Author Name", isbn: "1234567890", available_quantity: 10, shelf_location: "A1" }] }
  // #swagger.responses[500] = { description: 'Internal server error.' }

  const { title, author, isbn } = req.query;

  const queries = [];
  const values = [];

  if (title) queries.push("title = ?"), values.push(title);
  if (author) queries.push("author = ?"), values.push(author);
  if (isbn) queries.push("isbn = ?"), values.push(isbn);

  const conditions = queries.join(" AND ");

  const SQL_query = `SELECT id, title, description, author, isbn, available_quantity, shelf_location
FROM "Book"
${conditions.length ? "WHERE" : ""} ${conditions}`;

  const [data, metadata] = await sequelize.query(SQL_query, {
    replacements: values,
  });

  res.status(200).json(data);
};

export {
  listAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchOnBookBy,
};
