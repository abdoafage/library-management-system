import { BorrowProcessing } from "../models/borrowProcessing.model.js";
import { sequelize } from "../config.js";
import { parse } from "json2csv";
import { writeFileSync } from "fs";

const report_borrowing_process = async (req, res) => {
  /*
  #swagger.tags=['reports']

  #swagger.description = 'Generate a report on borrowing processes within a specified date range.' 
  #swagger.parameters['from'] = { 
    description: 'Start date (YYYY-MM-DD) for the report.', 
    in: 'path', 
    required: true, 
    type: 'string' 
  }
  #swagger.parameters['to'] = { 
    description: 'End date (YYYY-MM-DD) for the report.', 
    in: 'path', 
    required: true, 
    type: 'string' 
  }
  #swagger.responses[200] = { 
    description: 'Successfully generated the report.', 
    schema: { BorrowProcessing_id:"integer", email:"string", username:"string", title:"string", isbn:"integer", checkout_date:"date", due_date:"date", return_date:"date", return_status:"boolen", BorrowProcessing_createdAt:"date", BorrowProcessing_updatedAt:"date" }
  }
  #swagger.responses[500] = { 
    description: 'Internal Server Error',
  }
  */

  // create report on the borrowing processing.
  // {from, to} are date with format lke this YYYY-MM-DD
  const { from, to } = req.params;

  const from_date = new Date(from);
  const to_date = new Date(to);
  try {
    const SQL_query = `SELECT BP.id, email, username, title, isbn, checkout_date, due_date, return_date, return_status, BP.createdAt, BP.updatedAt 
    FROM BorrowProcessing BP
    INNER JOIN Book B
    ON BP.book_id = B.id
    INNER JOIN Borrower BR
    ON BP.borrower_id = BR.id
    WHERE checkout_date >= ? and checkout_date <= ?;
    `;

    const [data] = await sequelize.query(SQL_query, {
      replacements: [from_date, to_date],
    });

    const csv = parse(data, {
      fields: [
        "id",
        "email",
        "username",
        "title",
        "isbn",
        "checkout_date",
        "due_date",
        "return_date",
        "return_status",
        "createdAt",
        "updatedAt",
      ],
      delimiter: "|",
    });

    const report_date = Date.now();
    const filename = `./reports/report-${report_date}.csv`;
    writeFileSync(filename, csv, "utf-8");

    res.status(200).download(filename);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

  //   res.status(200).json(data);
};

const overdue_borrows = async (req, res) => {
  /*
  #swagger.tags=['reports']

  #swagger.description = 'Generate a report on overdue borrows.' 
  #swagger.responses[200] = { 
    description: 'Successfully generated the report.', 
    schema: { BorrowProcessing_id:"integer", email:"string", username:"string", title:"string", isbn:"integer", checkout_date:"date", due_date:"date", return_date:"date", return_status:"boolen", BorrowProcessing_createdAt:"date", BorrowProcessing_updatedAt:"date" }
  }
  #swagger.responses[500] = { 
    description: 'Internal Server Error',
  }
*/

  try {
    const SQL_query = `SELECT BP.id, email, username, title, isbn, checkout_date, due_date, return_date, return_status, BP.createdAt, BP.updatedAt 
    FROM BorrowProcessing BP
    INNER JOIN Book B
    ON BP.book_id = B.id
    INNER JOIN Borrower BR
    ON BP.borrower_id = BR.id
    WHERE (return_date IS NULL OR due_date <= return_date);
    `;

    const [data] = await sequelize.query(SQL_query);

    const csv = parse(data, {
      fields: [
        "id",
        "email",
        "username",
        "title",
        "isbn",
        "checkout_date",
        "due_date",
        "return_date",
        "return_status",
        "createdAt",
        "updatedAt",
      ],
      delimiter: "|",
    });

    const report_date = Date.now();
    const filename = `./reports/report-${report_date}.csv`;
    writeFileSync(filename, csv, "utf-8");

    res.status(200).download(filename);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export { report_borrowing_process, overdue_borrows };
