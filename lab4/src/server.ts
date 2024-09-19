import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db";
import newslettersRouter from "./routes/newslettersRoutes";
import subscribersRouter from "./routes/subscribersRoutes";
import path from "path";
import {
  renderHomePage,
  renderNewslettersPage,
  renderSubscribersPage,
} from "./views";

const app = express();
const port = 3000;

connectDB();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", renderHomePage);
app.get("/subscribers", renderSubscribersPage);
app.get("/newsletters", renderNewslettersPage);

app.use("/api", newslettersRouter);
app.use("/api", subscribersRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Варіант 10. Спроектувати базу даних про список розсилки і передплатників: тема і
// зміст листа, дата відправки, імена та адреси передплатників, їх облікові записи і
// паролі.
