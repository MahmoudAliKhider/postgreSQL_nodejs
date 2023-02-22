const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

app.use("/api/products", require("./router/product"));

const port = 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
