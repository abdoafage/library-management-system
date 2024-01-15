import { Router } from "express";
import {
  borrowBook,
  returnBook,
  listAllBorrowProcessing,
  booksBorrowedByBorrower,
  overdueDate,
} from "../controllers/borrowProcessing.controller.js";
import { limiter } from "../services/ratelimiter.service.js";
const router = Router();

// Borrow a book
router.route("/borrow/:borrowerId/:bookId").get(limiter, borrowBook);

// Return a book.
router.route("/return/:borrowerId/:bookId").get(returnBook);

router.route("/").get(limiter, listAllBorrowProcessing);

// List books borrowed by a borrower.
router.route("/borrowed/:borrowerId").get(booksBorrowedByBorrower);

router.route("/overdue").get(overdueDate);

export { router };
