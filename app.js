import express from "express";
import productsRoute from "./routes/products.js";

const app = express();
app.use(log);
app.use(express.static("./public"));
app.use(express.json());

app.use("/products", productsRoute);
app.listen(3000);

function log(req, res, next) {
  console.log("Path : ", req.path, " QS : ", req.query, " Body", req.body);
  next();
}
