const pool = require("../database/DB");

const router = require("express").Router();

router.get("/", async (req, res) => {
  let pageNumber =
    req.query.pageNumber == null || req.query.pageNumber < 1
      ? 1
      : +req.query.pageNumber;
  let pageSize =
    req.query.pageSize >= 15 || req.query.pageSize == null
      ? 10
      : +req.query.pageSize;
  const query = {};

  var keyword = req.query.keyword;
  if (keyword) {
    keyword = keyword.trim();
    query.$or = [{ title: { $regex: keyword, $options: "i" } }];
    var products = await pool.query(
      "SELECT title,description,id FROM products WHERE title LIKE '%' || $1 || '%'",
      [keyword]
    );
    var includeColors = req.query.includeColors;
    var includeSizes = req.query.includeSizes;
    if (includeColors == "true") {
      products = await pool.query(
        "SELECT title,description,colors,id FROM products WHERE title LIKE '%' || $1 || '%'",
        [keyword]
      );
    }
    if (includeSizes == "true") {
      products = await pool.query(
        "SELECT title,description,sizes,id FROM products WHERE title LIKE '%' || $1 || '%'",
        [keyword]
      );
    }
    if (includeSizes == "true" && includeColors == "true") {
      products = await pool.query(
        "SELECT title,description,colors,sizes,id FROM products WHERE title LIKE '%' || $1 || '%'",
        [keyword]
      );
    }
    return res.send(products.rows);
  }
  var product = await pool.query("SELECT title, description,id FROM products");
  var includeColors = req.query.includeColors;
    var includeSizes = req.query.includeSizes;
    if (includeColors == "true") {
      product = await pool.query(
        "SELECT title,description,colors,id FROM products" 
      );
    }
    if (includeSizes == "true") {
      product = await pool.query(
        "SELECT title,description,sizes,id FROM products"
      );
    }
    if (includeSizes == "true" && includeColors == "true") {
      product = await pool.query(
        "SELECT title,description,colors,sizes,id FROM products"
      );
    }
    return res.send(product.rows);
});

module.exports = router;
