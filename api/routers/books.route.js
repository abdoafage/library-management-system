import { Router } from "express";
import {
  listAllBooks,
  createBook,
  searchOnBookBy,
  getBook,
  updateBook,
  deleteBook,
} from "../controllers/books.controller.js";
const router = Router();

router.route("/").get(listAllBooks).post(createBook);

router.route("/search").get(searchOnBookBy);

router.route("/:id").get(getBook).put(updateBook).delete(deleteBook);

export { router };
