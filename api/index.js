import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { router as borrowersRouter } from "./routers/borrowers.route.js";
import { router as booksRouter } from "./routers/books.route.js";
import { router as borrowProcessingRouter } from "./routers/borrowProcessing.route.js";
import { router as reportRouter } from "./routers/reports.route.js";
import { sequelize } from "./config.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./services/swagger.json" assert { type: "json" };

const app = express();

// sequelize.sync();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/borrowers", borrowersRouter);
app.use("/books", booksRouter);
app.use("/borrowProcessing", borrowProcessingRouter);
app.use("/reports", reportRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export { app };
