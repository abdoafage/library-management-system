import { Router } from "express";
import {
  report_borrowing_process,
  overdue_borrows,
} from "../controllers/reports.controller.js";
const router = Router();

router.route("/borrowing-process/:from/:to").get(report_borrowing_process);

router.route("/overdue-borrows").get(overdue_borrows);

export { router };
