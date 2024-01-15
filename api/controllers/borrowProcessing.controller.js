import { BorrowProcessing } from "../models/borrowProcessing.model.js";
import { sequelize } from "../config.js";
import { Book } from "../models/books.model.js";
import { Borrower } from "../models/borrowers.model.js";

const borrowBook = async (req, res) => {
  /*  #swagger.tags=['borrowProcessing']

    #swagger.method('get')
    #swagger.description = 'Endpoint to borrow a book by a borrower.'

    #swagger.parameters['borrowerId'] = { 
      in: 'path',
      description: 'ID of the borrower',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['bookId'] = { 
      in: 'path',
      description: 'ID of the book to be borrowed',
      required: true,
      type: 'integer'
    }

    #swagger.responses[404] = { 
      description: 'His book is not available now.',
    }
    #swagger.responses[201] = { 
      description: 'Book successfully borrowed',
      schema:{ id:"integer", checkout_date:"date", due_date:"date", return_date:"date", return_status:"boolen", createdAt:"date", updatedAt:"date", book_id:"integer", borrower_id:"integer" }
    }
    #swagger.responses[400] = { 
      description: 'Bad request - This book borrowed by this borrower'
    }
    #swagger.responses[500] = { 
      description: 'Internal Server Error'
    }
*/

  const { borrowerId, bookId } = req.params;
  const book = await Book.findByPk(bookId);

  const { day } = req.params;

  if (!book?.available_quantity) {
    return res.status(404).json({ message: "This book is not available now." });
  }

  const borrower = await Borrower.findByPk(borrowerId);

  if (!borrower) {
    return res.status(404).json({ message: "This borrower does not exist." });
  }

  // you can not borrow the same book twice.
  const borrow = await BorrowProcessing.findOne({
    where: { book_id: bookId, borrower_id: borrowerId, return_status: false },
  });

  if (borrow)
    return res
      .status(400)
      .json({ message: "this book borrowed by this borrower" });

  try {
    const result = await sequelize.transaction(async () => {
      const newDate = new Date(new Date().getTime() + 1000 * 60); // after 1 minute.

      const data = await BorrowProcessing.create({
        book_id: bookId,
        borrower_id: borrowerId,
        due_date: newDate,
      });
      await Book.decrement("available_quantity", { where: { id: bookId } });

      return data;
    });

    console.log("result: ", result);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const returnBook = async (req, res) => {
  /*#swagger.tags=['borrowProcessing']

    #swagger.method('get')
    #swagger.description = 'Endpoint to return a borrowed book.'

    #swagger.parameters['borrowerId'] = { 
      in: 'path',
      description: 'ID of the borrower',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['bookId'] = { 
      in: 'path',
      description: 'ID of the book to be returned',
      required: true,
      type: 'integer'
    }

    #swagger.responses[200] = { 
      description: 'Book successfully returned',
      schema: { id:"integer", title:"string", author:"string", description:"string", isbn:"integer", available_quantity:"integer", shelf_location:"integer"}
    }
    #swagger.responses[400] = { 
      description: 'Bad request - Book not borrowed by the specified borrower'
    }
    #swagger.responses[500] = { 
      description: 'Internal Server Error'
    }
*/
  const { borrowerId, bookId } = req.params;

  const borrowed_book = await BorrowProcessing.findOne({
    where: { book_id: bookId, borrower_id: borrowerId, return_status: false },
  });

  if (!borrowed_book) {
    return res
      .status(400)
      .json({ message: "there is no book borrowed by this borrower" });
  }
  try {
    const result = await sequelize.transaction(async () => {
      borrowed_book.return_status = true;
      borrowed_book.return_date = new Date();
      await borrowed_book.save();
      await Book.increment("available_quantity", { where: { id: bookId } });
      return borrowed_book;
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const listAllBorrowProcessing = async (req, res) => {
  /*
  #swagger.tags=['borrowProcessing']

  #swagger.method('get')
  #swagger.summary = 'List all borrow processing entries'
  #swagger.description = 'Endpoint to retrieve a list of all borrow processing entries.'

  #swagger.responses[200] = {
    description: 'List of all borrow processing entries',
    schema: { id:"integer", checkout_date:"date", due_date:"date", return_date:"date", return_status:"boolen", createdAt:"date", updatedAt:"date", book_id:"integer", borrower_id:"integer" }
  }
  #swagger.responses[500] = {
    description: 'Internal Server Error'
  }
  */
  const SQL_query = `SELECT id, checkout_date, due_date, return_date, return_status, createdAt, updatedAt, book_id, borrower_id
  FROM BorrowProcessing;
  `;
  const [data] = await sequelize.query(SQL_query);
  res.status(200).json(data);
};

const booksBorrowedByBorrower = async (req, res) => {
  /*
  #swagger.tags=['borrowProcessing']

  #swagger.method('get')
  #swagger.description = 'Endpoint to retrieve a list of books borrowed by a specific borrower.'

  #swagger.parameters['borrowerId'] = { 
    in: 'path',
    description: 'ID of the borrower',
    required: true,
    type: 'integer'
  }

  #swagger.responses[200] = { 
    description: 'List of books borrowed by the specified borrower',
    schema: { title:"string", description:"string", author:"string", isbn:"integer" }
  }
  #swagger.responses[500] = { 
    description: 'Internal Server Error'
  }
  */
  const { borrowerId } = req.params;
  try {
    const SQL_query = `SELECT title, description, author, isbn
  FROM BorrowProcessing BP
  INNER JOIN Book B
  ON B.id = BP.book_id
  WHERE BP.return_status = 0 AND BP.borrower_id = ?;`;

    const [data] = await sequelize.query(SQL_query, {
      replacements: [borrowerId],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const overdueDate = async (req, res) => {
  /*
  #swagger.tags=['borrowProcessing']

  #swagger.method('get')
  #swagger.description = 'Endpoint to retrieve a list of overdue books.'

  #swagger.responses[200] = { 
    description: 'List of overdue books',
    schema: { "id": "integer",
        "checkout_date": "date",
        "due_date": "date",
        "return_date": "date",
        "return_status": "boolen",
        "createdAt": "date",
        "updatedAt": "date",
        "book_id": "integer",
        "borrower_id": "integer",
        "title": "string",
        "description": "string",
        author: "string",
        isbn: "integer",
        available_quantity: "integer",
        shelf_location: "integer" }
  }
  #swagger.responses[400] = { 
    description: 'Bad request - Unable to retrieve overdue books'
  }
  */
  const SQL_query = `SELECT *
  FROM BorrowProcessing BP
  INNER JOIN Book B
  ON B.id = BP.book_id
  WHERE BP.return_status = 0 AND ? >= BP.due_date;
  `;
  try {
    const current_date = new Date();
    const [data] = await sequelize.query(SQL_query, {
      replacements: [current_date],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

export {
  borrowBook,
  returnBook,
  listAllBorrowProcessing,
  booksBorrowedByBorrower,
  overdueDate,
};
